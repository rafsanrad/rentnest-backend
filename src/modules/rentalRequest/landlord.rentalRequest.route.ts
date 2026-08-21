import { Router } from "express";

import {
  getLandlordRentalRequestsController,
  updateRentalRequestStatusController,
} from "./rentalRequest.controller";

import { authorize } from "../../middleware/role.middleware";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation.middleware";
import { updateRentalRequestStatusSchema } from "../../validations/rentalRequest.validation";

const router = Router();

router.get(
  "/rental-requests",
  authenticate,
  authorize("LANDLORD"),
  getLandlordRentalRequestsController
);

router.patch(
  "/rental-requests/:id/status",
  authenticate,
  authorize("LANDLORD"),
  validate(updateRentalRequestStatusSchema),
  updateRentalRequestStatusController
);

export default router;