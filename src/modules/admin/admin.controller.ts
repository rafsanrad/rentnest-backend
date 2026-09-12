import { Request, Response } from "express";

import {
  banUser,
  getAdminStats,
  getAllPaymentsForAdmin,
  getAllPropertiesForAdmin,
  getAllRentalRequestsForAdmin,
  getAllUsers,
  unbanUser,
  updatePropertyStatusByAdmin,
} from "./admin.service";

export const getAdminStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const stats = await getAdminStats();

    return res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve admin statistics",
      errorDetails: null,
    });
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve users",
      errorDetails: null,
    });
  }
};

export const banUserController = async (
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

    const userId = req.params.id as string;

    const user = await banUser(
      userId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to ban user";

    const statusCode =
      message === "User not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

export const unbanUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id as string;

    const user = await unbanUser(userId);

    return res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to unban user";

    const statusCode =
      message === "User not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

export const getAllPropertiesForAdminController =
  async (req: Request, res: Response) => {
    try {
      const properties =
        await getAllPropertiesForAdmin();

      return res.status(200).json({
        success: true,
        message:
          "Properties retrieved successfully",
        data: properties,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve properties",
        errorDetails: null,
      });
    }
  };

export const updatePropertyStatusByAdminController =
  async (req: Request, res: Response) => {
    try {
      const propertyId =
        req.params.id as string;

      const { status } = req.body;

      const allowedStatuses = [
        "AVAILABLE",
        "RENTED",
        "UNAVAILABLE",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property status",
          errorDetails: null,
        });
      }

      const property =
        await updatePropertyStatusByAdmin(
          propertyId,
          status
        );

      return res.status(200).json({
        success: true,
        message:
          "Property status updated successfully",
        data: property,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update property status";

      const statusCode =
        message === "Property not found"
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message,
        errorDetails: null,
      });
    }
  };

export const getAllRentalRequestsForAdminController =
  async (req: Request, res: Response) => {
    try {
      const rentalRequests =
        await getAllRentalRequestsForAdmin();

      return res.status(200).json({
        success: true,
        message:
          "Rental requests retrieved successfully",
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

export const getAllPaymentsForAdminController =
  async (req: Request, res: Response) => {
    try {
      const payments =
        await getAllPaymentsForAdmin();

      return res.status(200).json({
        success: true,
        message:
          "Payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve payments",
        errorDetails: null,
      });
    }
  };