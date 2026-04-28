import ApiKey from "../models/APIkey.js";
import crypto from "crypto";

export const generateKey = async (req, res) => {
  try {
    const { apiId } = req.body;

    const key = "mk_" + crypto.randomBytes(32).toString("hex");

    const apiKey = await ApiKey.create({
      userId: req.user.id,
      apiId,
      key
    });

    res.status(201).json({ message: "API key generated", apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({ userId: req.user.id }).populate("apiId", "name baseUrl");
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const revokeKey = async (req, res) => {
  try {
    const key = await ApiKey.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "revoked" },
      { new: true }
    );

    if (!key) return res.status(404).json({ message: "Key not found" });

    res.json({ message: "Key revoked", key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};