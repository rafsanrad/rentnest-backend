import { Request, Response } from "express";
import Stripe from "stripe";
import { createCheckoutSession, handleStripeWebhook } from "./payment.service";

export const createCheckoutSessionController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        errorDetails: null,
      });
    }

    const { rentalRequestId } = req.body;

    if (!rentalRequestId) {
      return res.status(400).json({
        success: false,
        message: "Rental request ID is required",
        errorDetails: null,
      });
    }

    const session = await createCheckoutSession(
      rentalRequestId,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create checkout session";

    return res.status(400).json({
      success: false,
      message,
      errorDetails: null,
    });
  }
};

export const stripeWebhookController = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({
        success: false,
        message: "Stripe signature is missing",
      });
    }

    const result = await handleStripeWebhook(req.body, signature);

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
