import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

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
    originalName: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
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
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Add pagination plugin
submissionSchema.plugin(mongoosePaginate)

// Ensure one submission per student per task
submissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true })

// Index for better query performance
submissionSchema.index({ taskId: 1, createdAt: -1 })
submissionSchema.index({ studentId: 1, createdAt: -1 })

export const Submission = mongoose.model("Submission", submissionSchema)
