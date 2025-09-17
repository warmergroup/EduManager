import mongoose from "mongoose"

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [100, "Group name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCenter",
      default: null,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    maxStudents: {
      type: Number,
      required: true,
      default: 15,
      min: [1, "Max students must be at least 1"],
    },
    currentStudents: {
      type: Number,
      default: 0,
      min: [0, "Current students cannot be negative"],
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    schedule: [{
      dayOfWeek: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      room: {
        type: String,
        trim: true,
      },
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

// Create indexes
groupSchema.index({ teacherId: 1 })
groupSchema.index({ centerId: 1 })
groupSchema.index({ isActive: 1 })

export const Group = mongoose.model("Group", groupSchema)
