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