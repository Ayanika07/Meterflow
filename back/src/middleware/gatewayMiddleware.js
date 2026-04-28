import ApiKey from "../models/APIkey.js";
import UsageLog from "../models/UsageLog.js";

export const gatewayMiddleware = async (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ message: "API key required" });
  }

  // Validate key
  const apiKey = await ApiKey.findOne({ key }).populate("apiId");

  if (!apiKey) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  if (apiKey.status === "revoked") {
    return res.status(403).json({ message: "API key revoked" });
  }

  // Attach to request
  req.apiKey = apiKey;
  req.startTime = Date.now();

  // Log after response
  res.on("finish", async () => {
    try {
      await UsageLog.create({
        apiKeyId: apiKey._id,
        userId: apiKey.userId,
        apiId: apiKey.apiId._id,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        latency: Date.now() - req.startTime
      });
    } catch (err) {
      console.error("Logging error:", err.message);
    }
  });

  next();
};