import express from "express";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/BookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// Create booking
router.post("/", protect, createBooking);


// Get bookings
router.get("/", protect, getBookings);


// Update status
router.put("/:id/status", protect, updateBookingStatus);


// Cancel booking
router.delete("/:id", protect, cancelBooking);

export default router;