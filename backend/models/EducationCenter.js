import mongoose from "mongoose"

const educationCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Center name is required"],
      trim: true,
      maxlength: [100, "Center name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }],
    subscriptionPlanId: {
      type: String,
      required: true,
      default: "small_center",
    },
    subscriptionExpiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
educationCenterSchema.index({ adminId: 1 })
educationCenterSchema.index({ isActive: 1 })

export const EducationCenter = mongoose.model("EducationCenter", educationCenterSchema)
