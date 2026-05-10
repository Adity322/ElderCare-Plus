import express from "express";

import {
  addCareNote,
  getCareNotes,
  addReview,
} from "../controllers/careController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// 🧑‍⚕️ Caregiver adds note
router.post(
  "/:id/notes",
  protect,
  authorizeRoles("caregiver"),
  addCareNote
);


// 👨‍👩‍👦 User/Caregiver view notes
router.get(
  "/:id/notes",
  protect,
  getCareNotes
);


// ⭐ User adds review
router.post(
  "/:id/review",
  protect,
  authorizeRoles("user"),
  addReview
);

export default router;