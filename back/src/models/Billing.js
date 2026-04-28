
import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Api",
    required: true
  },
  totalRequests: {
    type: Number,
    default: 0
  },
  freeLimit: {
    type: Number,
    default: 1000  // first 1000 requests free
  },
  pricePerHundred: {
    type: Number,
    default: 0.5   // ₹0.5 per 100 requests after free limit
  },
  billableRequests: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  billingPeriodStart: {
    type: Date,
    required: true
  },
  billingPeriodEnd: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Billing", billingSchema);