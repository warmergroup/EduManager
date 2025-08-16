import express from "express"
import {
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  getStudentProgress,
  gradeSubmission,
} from "../controllers/submissionController.js"
import { protect, isStudent, teacherOnly } from "../middleware/auth.js"
import { upload, handleUploadError } from "../middleware/upload.js"
import { body, validationResult } from "express-validator"

const router = express.Router()

// All routes require authentication
router.use(protect)

// Validation for grading
const validateGrade = [
  body("score")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Score must be a number between 0 and 100"),
  body("feedback")
    .isLength({ min: 1, max: 500 })
    .withMessage("Feedback must be between 1 and 500 characters"),
]

// SPECIFIC ENDPOINTS FIRST (before generic ones)
// @route   GET /api/submissions/progress
// @desc    Get student progress
// @access  Private (Student only)
router.get("/progress", isStudent, getStudentProgress)

// @route   POST /api/submissions/:taskId
// @desc    Submit assignment file
// @access  Private (Student only)
router.post("/:taskId", isStudent, upload.single("file"), handleUploadError, submitAssignment)

// @route   GET /api/submissions/:taskId
// @desc    Get submissions for a task
// @access  Private (Students see own, Teachers see all for their tasks)
router.get("/:taskId", getSubmissions)

// @route   GET /api/submissions/single/:submissionId
// @desc    Get single submission by ID
// @access  Private (Student owns or Teacher created task)
router.get("/single/:submissionId", getSubmissionById)

// @route   PUT /api/submissions/:submissionId/grade
// @desc    Grade submission
// @access  Private (Teacher only - own tasks)
router.put("/:submissionId/grade", teacherOnly, validateGrade, gradeSubmission)

export default router
