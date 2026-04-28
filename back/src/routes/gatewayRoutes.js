import express from "express";
import { gatewayMiddleware } from "../middleware/gatewayMiddleware.js";
import { forwardRequest } from "../controllers/gatewayController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.all("/*path", rateLimiter, gatewayMiddleware, forwardRequest);

export default router;