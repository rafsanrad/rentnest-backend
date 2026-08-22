import { Router } from "express";

import {
  createReviewController,
  getPropertyReviewsController,
  updateReviewController,
  deleteReviewController,
} from "./review.controller";

import { authenticate } from "../../middleware/auth";

const router = Router();

// Create Review
router.post(
  "/",
  authenticate,
  createReviewController
);

// Get reviews of a property
router.get(
  "/property/:propertyId",
  getPropertyReviewsController
);

// Update own review
router.patch(
  "/:id",
  authenticate,
  updateReviewController
);

// Delete own review
router.delete(
  "/:id",
  authenticate,
  deleteReviewController
);

export default router;