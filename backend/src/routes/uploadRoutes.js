import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocuments,
} from "../controllers/uploadController.js";

const router = express.Router();


// Upload caregiver docs
router.post(
  "/documents",
  protect,
  authorizeRoles("caregiver"),
  upload.array("documents", 5),
  uploadDocuments
);

export default router;