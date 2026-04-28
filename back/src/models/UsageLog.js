import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  apiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ApiKey",
    required: true
  },
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
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: Number
  },
  latency: {
    type: Number  // in milliseconds
  }
}, { timestamps: true });

export default mongoose.model("UsageLog", usageLogSchema);