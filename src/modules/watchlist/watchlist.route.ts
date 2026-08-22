import { Router } from "express";

import {
  addToWatchlistController,
  getMyWatchlistController,
  removeFromWatchlistController,
} from "./watchlist.controller";

import { authenticate } from "../../middleware/auth";

const router = Router();

// Add property to watchlist
router.post(
  "/",
  authenticate,
  addToWatchlistController
);

// Get my watchlist
router.get(
  "/",
  authenticate,
  getMyWatchlistController
);

// Remove property from watchlist
router.delete(
  "/:propertyId",
  authenticate,
  removeFromWatchlistController
);

export default router;