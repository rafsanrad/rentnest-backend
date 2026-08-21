import { Router } from "express";

import {
  createPropertyController,
  updatePropertyController,
} from "./property.controller";
import { authorize } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createPropertySchema,
  updatePropertySchema,
} from "../../validations/property.validation";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/properties",
  authenticate,
  authorize("LANDLORD"),
  validate(createPropertySchema),
  createPropertyController
);

router.patch(
  "/properties/:id",
  authenticate,
  authorize("LANDLORD"),
  validate(updatePropertySchema),
  updatePropertyController
);

export default router;