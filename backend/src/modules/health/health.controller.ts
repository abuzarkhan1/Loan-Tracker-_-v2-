import mongoose from "mongoose";
import { env } from "../../config/env";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

const dbStateMap: Record<number, string> = {
  0: "disconnected",
  1: "healthy",
  2: "connecting",
  3: "disconnecting",
};

const getAppHealth = () => ({
  status: "healthy",
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  environment: env.NODE_ENV,
});

const getDbHealth = () => {
  const readyState = mongoose.connection.readyState;
  return {
    status: dbStateMap[readyState] || "unknown",
    readyState,
    database: mongoose.connection.name,
  };
};

export const getHealth = asyncHandler(async (_req, res) => {
  const data = {
    app: getAppHealth(),
    database: getDbHealth(),
  };

  const status =
    data.database.status === "healthy"
      ? "Loan Tracker API is healthy"
      : "Loan Tracker API is degraded";

  return sendResponse(res, 200, status, data);
});

export const getDbHealthStatus = asyncHandler(async (_req, res) => {
  return sendResponse(res, 200, "Database health fetched successfully", {
    ...getDbHealth(),
    timestamp: new Date().toISOString(),
  });
});
