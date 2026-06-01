import { Router } from "express";
import { getDbHealthStatus, getHealth } from "./health.controller";

const router = Router();

router.get("/", getHealth);
router.get("/db", getDbHealthStatus);

export default router;
