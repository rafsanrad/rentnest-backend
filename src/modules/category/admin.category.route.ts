import { Router } from "express";

import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller";

import { authorize } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validations/category.validation";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/categories",
  authenticate,
  authorize("ADMIN"),
  validate(createCategorySchema),
  createCategoryController
);

router.patch(
  "/categories/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateCategorySchema),
  updateCategoryController
);

router.delete(
  "/categories/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategoryController
);

export default router;