import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    qualifications: {
      type: String,
      required: true,
    },

    certifications: [String],

    experienceYears: {
      type: Number,
      required: true,
    },

    serviceAreas: [String], // cities or pincodes

    availability: [
      {
        date: String,
        slots: [String], // "morning", "evening"
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },
    profilePhoto:String,
    documents:[String],

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Caregiver", caregiverSchema);