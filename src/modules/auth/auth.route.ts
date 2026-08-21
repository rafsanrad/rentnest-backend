import { Router } from "express";

import {
  register,
  login,
  getMe,
} from "./auth.controller";
import {
  registerSchema,
  loginSchema,
} from "../../validations/auth.validation";
import { validate } from "../../middleware/validation.middleware";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authenticate,
  getMe
);

export default router;