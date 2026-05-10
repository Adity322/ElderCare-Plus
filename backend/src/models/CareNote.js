import mongoose from "mongoose";

const careNoteSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true,
    },

    noteText: {
      type: String,
      required: true,
    },

    activities: String,

    observations: String,

    nextRecommendations: String,
  },
  { timestamps: true }
);

export default mongoose.model("CareNote", careNoteSchema);