import express from "express";
import { createApi, getMyApis, deleteApi } from "../controllers/apiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApi);
router.get("/", protect, getMyApis);
router.delete("/:id", protect, deleteApi);

export default router;