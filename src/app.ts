import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import categoryRoutes from "./modules/category/category.route";
import adminCategoryRoutes from "./modules/category/admin.category.route";
import propertyRoutes from "./modules/property/property.route";
import landlordPropertyRoutes from "./modules/property/landlord.property.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminCategoryRoutes);
//separeted two routes
app.use("/api/properties", propertyRoutes);
app.use("/api/landlord", landlordPropertyRoutes);

export default app;