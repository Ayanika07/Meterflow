import UsageLog from "../models/UsageLog.js";

// Get all logs for logged in user
export const getMyLogs = async (req, res) => {
  try {
    const logs = await UsageLog.find({ userId: req.user.id })
      .populate("apiId", "name baseUrl")
      .populate("apiKeyId", "key")
      .sort({ createdAt: -1 })  // newest first
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logs for a specific API
export const getLogsByApi = async (req, res) => {
  try {
    const logs = await UsageLog.find({
      userId: req.user.id,
      apiId: req.params.apiId
    })
      .populate("apiId", "name baseUrl")
      .populate("apiKeyId", "key")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get usage summary for logged in user
export const getUsageSummary = async (req, res) => {
  try {
    const summary = await UsageLog.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$apiId",
          totalRequests: { $sum: 1 },
          avgLatency: { $avg: "$latency" },
          successCount: {
            $sum: { $cond: [{ $lt: ["$status", 400] }, 1, 0] }
          },
          errorCount: {
            $sum: { $cond: [{ $gte: ["$status", 400] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "apis",
          localField: "_id",
          foreignField: "_id",
          as: "api"
        }
      },
      { $unwind: "$api" },
      {
        $project: {
          apiName: "$api.name",
          baseUrl: "$api.baseUrl",
          totalRequests: 1,
          avgLatency: { $round: ["$avgLatency", 2] },
          successCount: 1,
          errorCount: 1
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};