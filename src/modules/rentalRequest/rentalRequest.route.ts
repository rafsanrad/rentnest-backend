import { Router } from "express";

import {
  createRentalRequestController,
  getMyRentalRequestsController,
} from "./rentalRequest.controller";
import { authorize } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createRentalRequestSchema,
} from "../../validations/rentalRequest.validation";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("TENANT"),
  validate(createRentalRequestSchema),
  createRentalRequestController
);

router.get(
  "/my",
  authenticate,
  authorize("TENANT"),
  getMyRentalRequestsController
);

export default router;