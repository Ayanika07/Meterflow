import express from "express";
import {
  generateBill,
  getMyBills,
  getBillingSummary,
  markAsPaid
} from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyBills);
router.get("/summary", protect, getBillingSummary);
router.post("/generate/:apiId", protect, generateBill);
router.patch("/pay/:billId", protect, markAsPaid);

export default router;