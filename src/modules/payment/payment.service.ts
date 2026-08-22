import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe";
import Stripe from "stripe";

export const createCheckoutSession = async (
  rentalRequestId: string,
  tenantId: string
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You are not allowed to make payment for this request"
    );
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new Error(
      "Payment can only be made for an approved rental request"
    );
  }

  if (rentalRequest.payment) {
    throw new Error("Payment already exists for this rental request");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "bdt",

          product_data: {
            name: `RentNest - ${rentalRequest.property.title}`,
            description: rentalRequest.property.description,
          },

          unit_amount:
            Number(rentalRequest.property.price) * 100,
        },

        quantity: 1,
      },
    ],

    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId: rentalRequest.tenantId,
      propertyId: rentalRequest.propertyId,
    },

    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel",
  });

  return session;
};

// ============================================
// Stripe Webhook
// ============================================

export const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string
) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
  }

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecret
  );

  // We only handle successful Checkout payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const rentalRequestId =
      session.metadata?.rentalRequestId;

    if (!rentalRequestId) {
      throw new Error(
        "Rental request ID is missing from Stripe metadata"
      );
    }

    // Prevent duplicate webhook processing
    const existingPayment = await prisma.payment.findUnique({
      where: {
        rentalRequestId,
      },
    });

    if (existingPayment) {
      return {
        success: true,
        message: "Payment already processed",
      };
    }

    const amount = session.amount_total
      ? session.amount_total / 100
      : 0;

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          transactionId: session.payment_intent as string,
          amount,
          provider: "STRIPE",
          status: "COMPLETED",
          paidAt: new Date(),
          rentalRequestId,
        },
      }),

      prisma.rentalRequest.update({
        where: {
          id: rentalRequestId,
        },
        data: {
          status: "ACTIVE",
        },
      }),
    ]);

    return {
      success: true,
      message: "Payment completed successfully",
    };
  }

  return {
    success: true,
    message: "Webhook received",
  };
};