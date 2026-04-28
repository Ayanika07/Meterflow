import express from "express";
import { getMyLogs, getLogsByApi, getUsageSummary } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyLogs);
router.get("/summary", protect, getUsageSummary);
router.get("/:apiId", protect, getLogsByApi);

export default router;