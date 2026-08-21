import { Router } from "express";
import { getPropertiesController } from "./property.controller";

const router = Router();

router.get("/", getPropertiesController);

export default router;