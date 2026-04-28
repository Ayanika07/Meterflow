import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
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
  key: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["active", "revoked"],
    default: "active"
  }
}, { timestamps: true });

export default mongoose.model("ApiKey", apiKeySchema);