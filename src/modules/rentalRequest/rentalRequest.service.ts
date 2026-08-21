import { prisma } from "../../lib/prisma";

interface CreateRentalRequestData {
  tenantId: string;
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export const createRentalRequest = async (
  data: CreateRentalRequestData
) => {
  // 1. Check if property exists
  const property = await prisma.property.findUnique({
    where: {
      id: data.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // 2. Check if property is available
  if (property.status !== "AVAILABLE") {
    throw new Error(
      "This property is not available for rental"
    );
  }

  // 3. Check if tenant already has a pending request
  const existingRequest =
    await prisma.rentalRequest.findFirst({
      where: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        status: "PENDING",
      },
    });

  if (existingRequest) {
    throw new Error(
      "You already have a pending request for this property"
    );
  }

  // 4. Create rental request
  const rentalRequest =
    await prisma.rentalRequest.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        moveInDate: new Date(data.moveInDate),
        message: data.message,
      },
      include: {
        property: true,
      },
    });

  return rentalRequest;
};