import { prisma } from "../../lib/prisma";

export const getAdminStats = async () => {
  const [
    totalUsers,
    totalTenants,
    totalLandlords,
    totalAdmins,
    totalProperties,
    availableProperties,
    rentedProperties,
    unavailableProperties,
    totalRentalRequests,
    pendingRentalRequests,
    activeRentals,
    completedRentals,
    totalPayments,
    completedPayments,
    totalRevenue,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "TENANT",
      },
    }),

    prisma.user.count({
      where: {
        role: "LANDLORD",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.property.count(),

    prisma.property.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.property.count({
      where: {
        status: "RENTED",
      },
    }),

    prisma.property.count({
      where: {
        status: "UNAVAILABLE",
      },
    }),

    prisma.rentalRequest.count(),

    prisma.rentalRequest.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.rentalRequest.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.rentalRequest.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.payment.count(),

    prisma.payment.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      tenants: totalTenants,
      landlords: totalLandlords,
      admins: totalAdmins,
    },

    properties: {
      total: totalProperties,
      available: availableProperties,
      rented: rentedProperties,
      unavailable: unavailableProperties,
    },

    rentals: {
      total: totalRentalRequests,
      pending: pendingRentalRequests,
      active: activeRentals,
      completed: completedRentals,
    },

    payments: {
      total: totalPayments,
      completed: completedPayments,
      revenue: totalRevenue._sum.amount
        ? Number(totalRevenue._sum.amount)
        : 0,
    },
  };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const banUser = async (
  userId: string,
  adminId: string
) => {
  if (userId === adminId) {
    throw new Error("You cannot ban yourself");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("You cannot ban another admin");
  }

  if (user.isBanned) {
    throw new Error("User is already banned");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isBanned: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
};

export const unbanUser = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isBanned) {
    throw new Error("User is not banned");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isBanned: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
};

export const getAllPropertiesForAdmin = async () => {
  return prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          isBanned: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updatePropertyStatusByAdmin = async (
  propertyId: string,
  status:
    | "AVAILABLE"
    | "RENTED"
    | "UNAVAILABLE"
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      status,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });
};

export const getAllRentalRequestsForAdmin =
  async () => {
    return prisma.rentalRequest.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            isBanned: true,
          },
        },

        property: {
          include: {
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        payment: true,
        review: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const getAllPaymentsForAdmin = async () => {
  return prisma.payment.findMany({
    include: {
      rentalRequest: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          property: {
            select: {
              id: true,
              title: true,
              location: true,
              price: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};