import { prisma } from "../../lib/prisma";

interface CreateReviewData {
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  rating: number;
  comment?: string;
}

// Create Review
export const createReview = async (
  data: CreateReviewData
) => {
  // 1. Validate rating
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // 2. Check rental request
  const rentalRequest =
    await prisma.rentalRequest.findUnique({
      where: {
        id: data.rentalRequestId,
      },
      include: {
        payment: true,
      },
    });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // 3. Check tenant ownership
  if (rentalRequest.tenantId !== data.tenantId) {
    throw new Error(
      "You are not allowed to review this rental request"
    );
  }

  // 4. Check property
  if (rentalRequest.propertyId !== data.propertyId) {
    throw new Error(
      "Property does not match this rental request"
    );
  }

  // 5. Check payment
  if (
    !rentalRequest.payment ||
    rentalRequest.payment.status !== "COMPLETED"
  ) {
    throw new Error(
      "You can only review after completing payment"
    );
  }

  // 6. Check if already reviewed
  const existingReview =
    await prisma.review.findUnique({
      where: {
        rentalRequestId: data.rentalRequestId,
      },
    });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this rental request"
    );
  }

  // 7. Create review
  const review = await prisma.review.create({
    data: {
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      rentalRequestId: data.rentalRequestId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return review;
};

// Get reviews of a property
export const getPropertyReviews = async (
  propertyId: string
) => {
  // Check property exists
  const property =
    await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

  if (!property) {
    throw new Error("Property not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },

    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// Update own review
export const updateReview = async (
  reviewId: string,
  tenantId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) => {
  // Validate rating if provided
  if (
    data.rating !== undefined &&
    (data.rating < 1 || data.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Find review
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Check ownership
  if (review.tenantId !== tenantId) {
    throw new Error(
      "You are not allowed to update this review"
    );
  }

  const updatedReview =
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

  return updatedReview;
};

// Delete own review
export const deleteReview = async (
  reviewId: string,
  tenantId: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Check ownership
  if (review.tenantId !== tenantId) {
    throw new Error(
      "You are not allowed to delete this review"
    );
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};