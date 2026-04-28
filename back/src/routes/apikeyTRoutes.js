import express from "express";
import { generateKey, getMyKeys, revokeKey } from "../controllers/apiKeyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateKey);
router.get("/", protect, getMyKeys);
router.patch("/revoke/:id", protect, revokeKey);

export default router;