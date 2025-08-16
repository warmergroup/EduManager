import express from "express"
import {askAI, generateTask, getAIStats} from "../controllers/aiController.js"
import { protect, isStudent, teacherOnly } from "../middleware/auth.js"
import {body, validationResult} from "express-validator"

const router = express.Router()

// All routes require authentication
router.use(protect)

// Validation for student AI chat
const validateAIQuestion = [
  body("question").trim().isLength({ min: 5, max: 1000 }).withMessage("Question must be between 5 and 1000 characters"),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    next()
  },
]

// Validation for task generation
const validateTaskGeneration = [
  body("subject").trim().isLength({ min: 2, max: 100 }).withMessage("Subject must be between 2 and 100 characters"),
  body("difficulty")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Difficulty must be one of: beginner, intermediate, advanced"),
  body("taskType")
    .isIn(["assignment", "project", "quiz", "essay", "presentation", "research", "practical"])
    .withMessage("Task type must be one of: assignment, project, quiz, essay, presentation, research, practical"),
  body("additionalRequirements")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Additional requirements cannot exceed 500 characters"),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    next()
  },
]

// @route   POST /api/ai/ask
// @desc    Student AI chat assistant
// @access  Private (Student only)
router.post("/ask", isStudent, validateAIQuestion, askAI)

// @route   POST /api/ai/generate-task
// @desc    Generate creative task via AI
// @access  Private (Teacher only)
router.post("/generate-task", teacherOnly, validateTaskGeneration, generateTask)

// @route   GET /api/ai/stats
// @desc    Get AI usage statistics
// @access  Private (Teacher only)
router.get("/stats", teacherOnly, getAIStats)

export default router
