import express from "express";
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPatient);
router.get("/", protect, getPatients);
router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, deletePatient);

export default router;