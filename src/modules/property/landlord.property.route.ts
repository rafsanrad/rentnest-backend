import { Router } from "express";

import {
  createPropertyController,
  deletePropertyController,
  getMyPropertiesController,
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

router.get(
  "/properties",
  authenticate,
  authorize("LANDLORD"),
  getMyPropertiesController
);

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

router.delete(
  "/properties/:id",
  authenticate,
  authorize("LANDLORD"),
  deletePropertyController
);

export default router;