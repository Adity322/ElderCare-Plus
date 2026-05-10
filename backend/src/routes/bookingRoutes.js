import express from "express";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
  submitReview,          // ← add this import
} from "../controllers/BookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // ← add this import

const router = express.Router();

// Create booking
router.post("/", protect, createBooking);

// Get bookings
router.get("/", protect, getBookings);

// Update status
router.put("/:id/status", protect, updateBookingStatus);

// Cancel booking
router.delete("/:id", protect, cancelBooking);

// ⭐ Submit review — add this line
router.post("/:id/review", protect, authorizeRoles("user"), submitReview);

export default router;
