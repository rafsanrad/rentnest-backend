import { prisma } from "../../lib/prisma";

interface AddToWatchlistData {
  tenantId: string;
  propertyId: string;
}

// Add property to watchlist
export const addToWatchlist = async (
  data: AddToWatchlistData
) => {
  // 1. Check property exists
  const property = await prisma.property.findUnique({
    where: {
      id: data.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // 2. Check if already in watchlist
  const existingWatchlist =
    await prisma.watchlist.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId: data.tenantId,
          propertyId: data.propertyId,
        },
      },
    });

  if (existingWatchlist) {
    throw new Error(
      "Property is already in your watchlist"
    );
  }

  // 3. Add to watchlist
  const watchlist = await prisma.watchlist.create({
    data: {
      tenantId: data.tenantId,
      propertyId: data.propertyId,
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          propertyType: true,
          bedrooms: true,
          bathrooms: true,
          imageUrl: true,
          status: true,
        },
      },
    },
  });

  return watchlist;
};

// Get my watchlist
export const getMyWatchlist = async (
  tenantId: string
) => {
  const watchlist = await prisma.watchlist.findMany({
    where: {
      tenantId,
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          price: true,
          propertyType: true,
          bedrooms: true,
          bathrooms: true,
          amenities: true,
          imageUrl: true,
          status: true,
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return watchlist;
};

// Remove property from watchlist
export const removeFromWatchlist = async (
  tenantId: string,
  propertyId: string
) => {
  const watchlist =
    await prisma.watchlist.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId,
          propertyId,
        },
      },
    });

  if (!watchlist) {
    throw new Error(
      "Property is not in your watchlist"
    );
  }

  await prisma.watchlist.delete({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId,
      },
    },
  });
};