import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import categoryRoutes from "./modules/category/category.route";
import adminCategoryRoutes from "./modules/category/admin.category.route";
import propertyRoutes from "./modules/property/property.route";

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
app.use("/api/landlord", propertyRoutes);

export default app;