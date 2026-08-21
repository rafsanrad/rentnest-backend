import { Request, Response } from "express";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.service";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      errorDetails: null,
    });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await createCategory(name, description);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create category",
      errorDetails: null,
    });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description } = req.body;

    const category = await updateCategory(id, name, description);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update category",
      errorDetails: null,
    });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete category",
      errorDetails: null,
    });
  }
};
