import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true,
    },

    serviceType: {
      type: String,
      enum: [
        "Nursing Care",
        "Elderly Attendant",
        "Physiotherapy",
        "Post-Hospital Care",
      ],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      required: true,
    },

    duration: {
      type: String,
      enum: ["hourly", "daily", "long-term"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);