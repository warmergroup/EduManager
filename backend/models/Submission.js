import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [500, "Feedback cannot exceed 500 characters"],
      default: "",
    },
    isGraded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one submission per student per task
submissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true })

// Index for better query performance
submissionSchema.index({ taskId: 1, createdAt: -1 })
submissionSchema.index({ studentId: 1, createdAt: -1 })

export const Submission = mongoose.model("Submission", submissionSchema)
