import { Request, Response } from "express";
import { getAllCategories } from "./category.service";

export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      errorDetails: null,
    });
  }
};