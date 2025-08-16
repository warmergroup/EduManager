import express from "express"
import {
  getVideos,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  getMyVideos,
  getVideoStats,
} from "../controllers/videoController.js"
import { protect, teacherOnly } from "../middleware/auth.js"
import { validateVideo } from "../middleware/validation.js"

const router = express.Router()

// All routes require authentication
router.use(protect)

// @route   GET /api/videos
// @desc    Get all video lessons
// @access  Private (Students and Teachers)
router.get("/", getVideos)

// @route   GET /api/videos/teacher/my-videos
// @desc    Get teacher's own videos
// @access  Private (Teacher only)
router.get("/teacher/my-videos", teacherOnly, getMyVideos)

// @route   GET /api/videos/stats
// @desc    Get video statistics for teacher
// @access  Private (Teacher only)
router.get("/stats", teacherOnly, getVideoStats)

// @route   GET /api/videos/:id
// @desc    Get single video by ID
// @access  Private (Students and Teachers)
router.get("/:id", getVideoById)

// @route   POST /api/videos
// @desc    Add new video lesson
// @access  Private (Teacher only)
router.post("/", teacherOnly, validateVideo, addVideo)

// @route   PUT /api/videos/:id
// @desc    Update video lesson
// @access  Private (Teacher only - own videos)
router.put("/:id", teacherOnly, validateVideo, updateVideo)

// @route   DELETE /api/videos/:id
// @desc    Delete video lesson
// @access  Private (Teacher only - own videos)
router.delete("/:id", teacherOnly, deleteVideo)

export default router
