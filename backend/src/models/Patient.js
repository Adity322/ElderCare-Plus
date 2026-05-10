import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    age: Number,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    medicalConditions: String,

    mobilityStatus: String,

    specialRequirements: String,
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);