import { Request, Response } from "express";
import { createProperty ,getAllProperties, getPropertyById} from "./property.service";

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

export const getPropertiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      categoryId,
    } = req.query;

    const properties = await getAllProperties({
      search: search as string | undefined,
      location: location as string | undefined,
      minPrice: minPrice
        ? Number(minPrice)
        : undefined,
      maxPrice: maxPrice
        ? Number(maxPrice)
        : undefined,
      propertyType: propertyType as string | undefined,
      bedrooms: bedrooms
        ? Number(bedrooms)
        : undefined,
      categoryId: categoryId as string | undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve properties",
      errorDetails: null,
    });
  }
};

export const getPropertyByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const property = await getPropertyById(id);

    return res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: property,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Property not found",
      errorDetails: null,
    });
  }
};