import { Request, Response } from "express";

import {
  addToWatchlist,
  getMyWatchlist,
  removeFromWatchlist,
} from "./watchlist.service";

// Add to Watchlist
export const addToWatchlistController = async (
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

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
        errorDetails: null,
      });
    }

    const watchlist = await addToWatchlist({
      tenantId: req.user.userId,
      propertyId,
    });

    return res.status(201).json({
      success: true,
      message: "Property added to watchlist successfully",
      data: watchlist,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to add property to watchlist";

    return res.status(400).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

// Get My Watchlist
export const getMyWatchlistController = async (
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

    const watchlist = await getMyWatchlist(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Your watchlist retrieved successfully",
      data: watchlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve watchlist",
      errorDetails: null,
    });
  }
};

// Remove from Watchlist
export const removeFromWatchlistController = async (
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

    const propertyId = req.params.propertyId as string;

    await removeFromWatchlist(
      req.user.userId,
      propertyId
    );

    return res.status(200).json({
      success: true,
      message: "Property removed from watchlist successfully",
      data: null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to remove property from watchlist";

    return res.status(400).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};