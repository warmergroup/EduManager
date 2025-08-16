import mongoose from "mongoose"

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    url: {
      type: String,
      required: [true, "Video URL is required"],
      validate: {
        validator: (value) => {
          // Basic YouTube URL validation
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(value)
        },
        message: "Please provide a valid YouTube URL",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
videoSchema.index({ createdBy: 1, createdAt: -1 })

export const Video = mongoose.model("Video", videoSchema)
