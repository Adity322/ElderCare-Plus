import express from "express";
import Caregiver from "../models/Caregiver.js"
import upload from "../middleware/uploadMiddleware.js"
import Review from "../models/Review.js"
import {
  createCaregiverProfile,
  getCaregivers,
  getSingleCaregiver,
  updateCaregiver,
  verifyCaregiver,
  updateAvailability,
} from "../controllers/caregiverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCaregivers);

// ✅ ALL named GET routes ABOVE /:id
router.get(
  "/me",
  protect,
  authorizeRoles("caregiver"),
  async (req, res) => {
    try {
      const caregiver = await Caregiver.findOne({ userId: req.user._id })
        .populate("userId", "name email phone")
      res.json(caregiver)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const caregivers = await Caregiver.find()
        .populate("userId", "name email phone")
      res.json(caregivers)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  "/my-reviews",
  protect,
  authorizeRoles("caregiver"),
  async (req, res) => {
    try {
      const caregiver = await Caregiver.findOne({ userId: req.user._id })
      if (!caregiver) return res.json([])
      const reviews = await Review.find({ caregiverId: caregiver._id })
        .populate("userId", "name")
        .sort({ createdAt: -1 })
      res.json(reviews)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// /:id must be BELOW all named GET routes
router.get("/:id", protect, getSingleCaregiver);

// Caregiver only
router.post(
  "/profile",
  protect,
  authorizeRoles("caregiver"),
  createCaregiverProfile
);
router.put(
  "/profile",
  protect,
  authorizeRoles("caregiver"),
  updateCaregiver
);
router.put(
  "/availability",
  protect,
  authorizeRoles("caregiver"),
  updateAvailability
);
router.put(
  "/profile/photo",
  protect,
  authorizeRoles("caregiver"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const caregiver = await Caregiver.findOneAndUpdate(
        { userId: req.user._id },
        { profilePhoto: req.file.path },
        { new: true }
      )
      res.json({ profilePhoto: caregiver.profilePhoto })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// Admin only
router.put(
  "/:id/verify",
  protect,
  authorizeRoles("admin"),
  verifyCaregiver
);

export default router;
