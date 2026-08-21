import { Router } from "express";

import { createPropertyController } from "./property.controller";

import { authorize } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";

import { createPropertySchema } from "../../validations/property.validation";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/properties",
  authenticate,
  authorize("LANDLORD"),
  validate(createPropertySchema),
  createPropertyController
);

export default router;