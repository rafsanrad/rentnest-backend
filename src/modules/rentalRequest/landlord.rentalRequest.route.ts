import { Router } from "express";

import {
  getLandlordRentalRequestsController,
} from "./rentalRequest.controller";

import { authorize } from "../../middleware/role.middleware";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/rental-requests",
  authenticate,
  authorize("LANDLORD"),
  getLandlordRentalRequestsController
);

export default router;