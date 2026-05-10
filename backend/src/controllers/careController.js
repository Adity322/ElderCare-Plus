import CareNote from "../models/CareNote.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Caregiver from "../models/Caregiver.js";


// ➕ Add Care Note
export const addCareNote = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const careNote = await CareNote.create({
      bookingId: booking._id,
      caregiverId: booking.caregiverId,
      ...req.body,
    });

    res.status(201).json(careNote);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};




// 📥 Get Care Notes
export const getCareNotes = async (req, res) => {
  try {

    const notes = await CareNote.find({
      bookingId: req.params.id,
    });

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};




// ⭐ Add Review
export const addReview = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const review = await Review.create({
      bookingId: booking._id,
      userId: req.user._id,
      caregiverId: booking.caregiverId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    // ⭐ Update caregiver average rating
    const reviews = await Review.find({
      caregiverId: booking.caregiverId,
    });

    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0)
      / reviews.length;

    await Caregiver.findByIdAndUpdate(
      booking.caregiverId,
      {
        rating: avgRating.toFixed(1),
      }
    );

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};