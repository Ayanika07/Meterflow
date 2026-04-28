import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import apiKeyRoutes from "./routes/apikeyTRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import gatewayRoutes from "./routes/gatewayRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://meterflow.netlify.app/login"  // ← add this after you get Netlify URL
  ]
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/apikey", apiKeyRoutes);
app.use("/apis", apiRoutes);
app.use("/gateway", gatewayRoutes);
app.use("/logs", logRoutes);
app.use("/billing", billingRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("MeterFlow API running");
});

app.listen(5000, () => console.log("Server running on port 5000"));