import { Request, Response } from "express";

import {
  createRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
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

export const getLandlordRentalRequestsController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        errorDetails: null,
      });
    }

    const rentalRequests =
      await getLandlordRentalRequests(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentalRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve rental requests",
      errorDetails: null,
    });
  }
};

export const updateRentalRequestStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        errorDetails: null,
      });
    }

    const requestId = req.params.id as string;

    const updatedRequest =
      await updateRentalRequestStatus(
        requestId,
        req.user.userId,
        req.body.status
      );

    return res.status(200).json({
      success: true,
      message: `Rental request ${req.body.status.toLowerCase()} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update rental request";

    const statusCode =
      message === "Rental request not found"
        ? 404
        : message.includes("not allowed")
        ? 403
        : 400;

    return res.status(statusCode).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};