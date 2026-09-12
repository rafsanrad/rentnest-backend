import { Router } from "express";

import {
  banUserController,
  getAdminStatsController,
  getAllPaymentsForAdminController,
  getAllPropertiesForAdminController,
  getAllRentalRequestsForAdminController,
  getAllUsersController,
  unbanUserController,
  updatePropertyStatusByAdminController,
} from "./admin.controller";

import { authenticate } from "../../middleware/auth";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

router.use(
  authenticate,
  authorize("ADMIN")
);

router.get(
  "/stats",
  getAdminStatsController
);

router.get(
  "/users",
  getAllUsersController
);

router.patch(
  "/users/:id/ban",
  banUserController
);

router.patch(
  "/users/:id/unban",
  unbanUserController
);

router.get(
  "/properties",
  getAllPropertiesForAdminController
);

router.patch(
  "/properties/:id/status",
  updatePropertyStatusByAdminController
);

router.get(
  "/rental-requests",
  getAllRentalRequestsForAdminController
);

router.get(
  "/payments",
  getAllPaymentsForAdminController
);

export default router;