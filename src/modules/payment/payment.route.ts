import { Router } from "express";
import {
  createCheckoutSessionController,
} from "./payment.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/create-checkout-session",
  authenticate,
  createCheckoutSessionController
);

export default router;