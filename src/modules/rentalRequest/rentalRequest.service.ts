import { prisma } from "../../lib/prisma";

interface CreateRentalRequestData {
  tenantId: string;
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export const createRentalRequest = async (
  data: CreateRentalRequestData
) => {
  // 1. Check if property exists
  const property = await prisma.property.findUnique({
    where: {
      id: data.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // 2. Check if property is available
  if (property.status !== "AVAILABLE") {
    throw new Error(
      "This property is not available for rental"
    );
  }

  // 3. Check if tenant already has a pending request
  const existingRequest =
    await prisma.rentalRequest.findFirst({
      where: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        status: "PENDING",
      },
    });

  if (existingRequest) {
    throw new Error(
      "You already have a pending request for this property"
    );
  }

  // 4. Create rental request
  const rentalRequest =
    await prisma.rentalRequest.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        moveInDate: new Date(data.moveInDate),
        message: data.message,
      },
      include: {
        property: true,
      },
    });

  return rentalRequest;
};

export const getLandlordRentalRequests = async (
  landlordId: string
) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },

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
          status: true,
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;
};

export const updateRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED"
) => {
  // 1. Find rental request
  const rentalRequest =
    await prisma.rentalRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        property: true,
      },
    });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // 2. Check property ownership
  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error(
      "You are not allowed to update this rental request"
    );
  }

  // 3. Request must be pending
  if (rentalRequest.status !== "PENDING") {
    throw new Error(
      "Only pending rental requests can be updated"
    );
  }

  // 4. If approved, make sure property is still available
  if (
    status === "APPROVED" &&
    rentalRequest.property.status !== "AVAILABLE"
  ) {
    throw new Error(
      "This property is no longer available"
    );
  }

  // 5. Update rental request
  const updatedRequest =
    await prisma.rentalRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: true,
      },
    });

  // 6. If approved, mark property as RENTED
  if (status === "APPROVED") {
    await prisma.property.update({
      where: {
        id: rentalRequest.propertyId,
      },
      data: {
        status: "RENTED",
      },
    });
  }

  return updatedRequest;
};