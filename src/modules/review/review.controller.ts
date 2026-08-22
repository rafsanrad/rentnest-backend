import { Request, Response } from "express";

import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
} from "./review.service";

// Create Review
export const createReviewController = async (
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

    const {
      propertyId,
      rentalRequestId,
      rating,
      comment,
    } = req.body;

    const review = await createReview({
      tenantId: req.user.userId,
      propertyId,
      rentalRequestId,
      rating: Number(rating),
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create review";

    return res.status(400).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

// Get Property Reviews
export const getPropertyReviewsController = async (
  req: Request,
  res: Response
) => {
  try {
    const propertyId = req.params.propertyId as string;

    const reviews =
      await getPropertyReviews(propertyId);

    return res.status(200).json({
      success: true,
      message: "Property reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve reviews";

    const statusCode =
      message === "Property not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

// Update Review
export const updateReviewController = async (
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

    const reviewId = req.params.id as string;

    const updatedReview = await updateReview(
      reviewId,
      req.user.userId,
      {
        rating:
          req.body.rating !== undefined
            ? Number(req.body.rating)
            : undefined,
        comment: req.body.comment,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update review";

    const statusCode =
      message === "Review not found"
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

// Delete Review
export const deleteReviewController = async (
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

    const reviewId = req.params.id as string;

    await deleteReview(
      reviewId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete review";

    const statusCode =
      message === "Review not found"
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