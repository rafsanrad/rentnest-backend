import { Request, Response } from "express";

import {
  createRentalRequest,
} from "./rentalRequest.service";

export const createRentalRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        errorDetails: null,
      });
    }

    // Create rental request
    const rentalRequest =
      await createRentalRequest({
        tenantId: req.user.userId,
        propertyId: req.body.propertyId,
        moveInDate: req.body.moveInDate,
        message: req.body.message,
      });

    return res.status(201).json({
      success: true,
      message: "Rental request created successfully",
      data: rentalRequest,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create rental request",
      errorDetails: null,
    });
  }
};