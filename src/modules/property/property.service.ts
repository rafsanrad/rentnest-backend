import { prisma } from "../../lib/prisma";

interface CreatePropertyData {
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  imageUrl?: string;
  categoryId: string;
  landlordId: string;
}

export const createProperty = async (
  data: CreatePropertyData
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      amenities: data.amenities,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      landlordId: data.landlordId,
    },
    include: {
      category: true,
    },
  });

  return property;
};

export const getAllProperties = async (filters: {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  categoryId?: string;
}) => {
  const {
    search,
    location,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    categoryId,
  } = filters;

  const properties = await prisma.property.findMany({
    where: {
      status: "AVAILABLE",

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(location && {
        location: {
          contains: location,
          mode: "insensitive",
        },
      }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: minPrice,
              }),
              ...(maxPrice !== undefined && {
                lte: maxPrice,
              }),
            },
          }
        : {}),

      ...(propertyType && {
        propertyType: {
          equals: propertyType,
          mode: "insensitive",
        },
      }),

      ...(bedrooms !== undefined && {
        bedrooms: {
          gte: bedrooms,
        },
      }),

      ...(categoryId && {
        categoryId,
      }),
    },

    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: true,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};