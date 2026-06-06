import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import contactRoutes from "./modules/contacts/contact.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import healthRoutes from "./modules/health/health.routes";
import goalRoutes from "./modules/goals/goal.routes";
import loanRoutes from "./modules/loans/loan.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";

export const app = express();

app.use(helmet());
app.use(requestIdMiddleware);
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV !== "test") {
  app.use(requestLoggerMiddleware);
}

app.use("/health", healthRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/health", healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
