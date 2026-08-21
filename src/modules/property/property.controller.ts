import { Request, Response } from "express";
import { createProperty } from "./property.service";

export const createPropertyController = async (
  req: Request,
  res: Response
) => {
  try {
    const landlordId = req.user!.userId ;

    const property = await createProperty({
      ...req.body,
      landlordId,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create property",
      errorDetails: null,
    });
  }
};