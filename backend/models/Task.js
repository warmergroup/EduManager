import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: (value) => value > new Date(),
        message: "Deadline must be in the future",
      },
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
taskSchema.index({ createdBy: 1, createdAt: -1 })
taskSchema.index({ deadline: 1 })

export const Task = mongoose.model("Task", taskSchema)
