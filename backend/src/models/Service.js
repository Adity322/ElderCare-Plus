import mongoose from "mongoose"

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "Nursing Care",
        "Elderly Attendant",
        "Physiotherapy",
        "Post-Hospital Care",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    durationOptions: [String],
    priceRange: {
      type: String,
    },
    requiredQualification: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Service", serviceSchema)