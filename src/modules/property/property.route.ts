import { Router } from "express";

import {
  getPropertiesController,
  getPropertyByIdController,
} from "./property.controller";

const router = Router();

router.get(
  "/",
  getPropertiesController
);

router.get(
  "/:id",
  getPropertyByIdController
);

export default router;