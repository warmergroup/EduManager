import { Task } from "../models/Task.js"
import { Submission } from "../models/Submission.js"

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query

    // Build search query
    let query = {}
    if (search) {
      query = {
        $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Task.countDocuments(query)

    // Get tasks with creator info
    const tasks = await Task.find(query)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // If user is a student, add submission status for each task
    let tasksWithSubmissions = tasks
    if (req.user.role === "student") {
      tasksWithSubmissions = await Promise.all(
        tasks.map(async (task) => {
          const submission = await Submission.findOne({
            taskId: task._id,
            studentId: req.user.id,
          })

          return {
            ...task.toObject(),
            hasSubmitted: !!submission,
            submissionId: submission?._id || null,
            isGraded: submission?.isGraded || false,
            score: submission?.score || null,
          }
        }),
      )
    }

    res.json({
      success: true,
      data: {
        tasks: tasksWithSubmissions,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTasks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ message: "Server error while fetching tasks" })
  }
}

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("createdBy", "fullName email")

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // If user is a student, add submission info
    let taskData = task.toObject()
    if (req.user.role === "student") {
      const submission = await Submission.findOne({
        taskId: task._id,
        studentId: req.user.id,
      })

      taskData = {
        ...taskData,
        hasSubmitted: !!submission,
        submissionId: submission?._id || null,
        isGraded: submission?.isGraded || false,
        score: submission?.score || null,
        feedback: submission?.feedback || "",
      }
    }

    res.json({
      success: true,
      data: { task: taskData },
    })
  } catch (error) {
    console.error("Get task by ID error:", error)
    res.status(500).json({ message: "Server error while fetching task" })
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Teacher only)
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body

    const task = await Task.create({
      title,
      description,
      deadline: new Date(deadline),
      createdBy: req.user.id,
    })

    // Populate creator info
    await task.populate("createdBy", "fullName email")

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ message: "Server error while creating task" })
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Teacher only - own tasks)
export const updateTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body

    // Find task and check ownership
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if the teacher owns this task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task" })
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        deadline: new Date(deadline),
      },
      { new: true, runValidators: true },
    ).populate("createdBy", "fullName email")

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task: updatedTask },
    })
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({ message: "Server error while updating task" })
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Teacher only - own tasks)
export const deleteTask = async (req, res) => {
  try {
    // Find task and check ownership
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if the teacher owns this task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" })
    }

    // Delete all submissions for this task
    await Submission.deleteMany({ taskId: req.params.id })

    // Delete the task
    await Task.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Task and all related submissions deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ message: "Server error while deleting task" })
  }
}

// @desc    Get task statistics for teacher
// @route   GET /api/tasks/:id/stats
// @access  Private (Teacher only)
export const getTaskStats = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if the teacher owns this task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view task statistics" })
    }

    // Get submission statistics
    const totalSubmissions = await Submission.countDocuments({ taskId: req.params.id })
    const gradedSubmissions = await Submission.countDocuments({ taskId: req.params.id, isGraded: true })
    const pendingSubmissions = totalSubmissions - gradedSubmissions

    // Get average score for graded submissions
    const avgScoreResult = await Submission.aggregate([
      { $match: { taskId: task._id, isGraded: true, score: { $ne: null } } },
      { $group: { _id: null, averageScore: { $avg: "$score" } } },
    ])

    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].averageScore * 100) / 100 : 0

    res.json({
      success: true,
      data: {
        taskId: task._id,
        taskTitle: task.title,
        statistics: {
          totalSubmissions,
          gradedSubmissions,
          pendingSubmissions,
          averageScore,
        },
      },
    })
  } catch (error) {
    console.error("Get task stats error:", error)
    res.status(500).json({ message: "Server error while fetching task statistics" })
  }
}
