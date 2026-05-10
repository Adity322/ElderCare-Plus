import Booking from "../models/Booking.js";
import { io } from "../../server.js"
import Caregiver from "../models/Caregiver.js"
import Review from "../models/Review.js"
// ➕ Create Booking
export const createBooking = async (req, res) => {
  try {
    const {
      patientId,
      caregiverId,
      serviceType,
      startDate,
      shift,
      duration,
    } = req.body;

    // 🚫 Prevent double booking
    const existingBooking = await Booking.findOne({
      caregiverId,
      startDate,
      shift,
      status: {
        $in: ["requested", "confirmed", "in-progress"],
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Caregiver already booked for this slot",
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      patientId,
      caregiverId,
      serviceType,
      startDate,
      shift,
      duration,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// 📥 Get Bookings (Role-based)
export const getBookings = async (req, res) => {
  try {

    let bookings;

    // 👨 User
    if (req.user.role === "user") {
      bookings = await Booking.find({
        userId: req.user._id,
      })
        .populate("patientId")
        .populate({
          path: "caregiverId",
          populate: {
            path: "userId",
            select: "name email phone",
          },
        });
    }

    // 🧑‍⚕️ Caregiver
    else if (req.user.role === "caregiver") {
  // first find this caregiver's profile
  const caregiver = await Caregiver.findOne({ userId: req.user._id })
  if (!caregiver) {
    return res.json([])
  }
  bookings = await Booking.find({ caregiverId: caregiver._id })
    .populate("patientId")
    .populate("userId", "name email phone")
}
    // 👑 Admin
    else if (req.user.role === "admin") {

      bookings = await Booking.find()
        .populate("patientId")
        .populate("userId", "name email")
        .populate({
          path: "caregiverId",
          populate: {
            path: "userId",
            select: "name email",
          },
        });
    }

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};




// 🔄 Update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();
    io.emit("bookingStatusUpdated", {
      bookingId: booking._id,
      status: booking.status,
    })

    res.json({
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ⭐ Submit Review
export const submitReview = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only review completed bookings" })
    }

    const existingReview = await Review.findOne({ bookingId: req.params.id })
    if (existingReview) {
      return res.status(400).json({ message: "Review already submitted" })
    }

    const review = await Review.create({
      bookingId: booking._id,
      userId: req.user._id,
      caregiverId: booking.caregiverId,  // ← from booking, not user input
      rating: req.body.rating,
      comment: req.body.comment,
    })

    // Recalculate caregiver average rating
    const allReviews = await Review.find({ caregiverId: booking.caregiverId })
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await Caregiver.findByIdAndUpdate(booking.caregiverId, {
      rating: Math.round(avg * 10) / 10,
    })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}



// ❌ Cancel Booking
export const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
