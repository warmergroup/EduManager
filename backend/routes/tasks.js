import express from "express"
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  upload
} from "../controllers/taskController.js"
import { protect, teacherOnly } from "../middleware/auth.js"
import { validateTask } from "../middleware/validation.js"

const router = express.Router()

// All routes require authentication
router.use(protect)

// @route   GET /api/tasks
// @desc    Get all tasks (with pagination and search)
// @access  Private (Students and Teachers)
router.get("/", getTasks)

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private (Students and Teachers)
router.get("/:id", getTaskById)

// @route   GET /api/tasks/:id/stats
// @desc    Get task statistics
// @access  Private (Teacher only - own tasks)
router.get("/:id/stats", teacherOnly, getTaskStats)

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Teacher only)
router.post("/", teacherOnly, upload.single('file'), validateTask, createTask)

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Teacher only - own tasks)
router.put("/:id", teacherOnly, upload.single('file'), validateTask, updateTask)

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Teacher only - own tasks)
router.delete("/:id", teacherOnly, deleteTask)

export default router
