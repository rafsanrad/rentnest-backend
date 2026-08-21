import { prisma } from "../../lib/prisma";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createCategory = async (
  name: string,
  description?: string
) => {
  const existing = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existing) {
    throw new Error("Category already exists");
  }

  return await prisma.category.create({
    data: {
      name,
      description,
    },
  });
};

export const updateCategory = async (
  id: string,
  name?: string,
  description?: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    },
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
};