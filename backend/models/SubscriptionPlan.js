import mongoose from "mongoose"

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["individual", "center"],
      required: true,
    },
    maxGroups: {
      type: Number,
      required: true,
      min: [0, "Max groups cannot be negative"],
    },
    maxStudents: {
      type: Number,
      required: true,
      min: [0, "Max students cannot be negative"],
    },
    maxTeachers: {
      type: Number,
      default: null,
      min: [0, "Max teachers cannot be negative"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "UZS",
      enum: ["UZS", "USD"],
    },
    features: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema)
