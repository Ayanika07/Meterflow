import crypto from "crypto";

export const generateApiKey = () => {
  return "mf_live_" + crypto.randomBytes(16).toString("hex");
};