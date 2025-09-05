import express from 'express';
import { protect, teacherOnly } from '../middleware/auth.js';
import {
    getAllUsers,
    getStudentsWithStats,
    getUserProfile,
    updateUserProfile,
    getTeacherStats,
    getStudentStats
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user profile (own profile)
router.get('/profile', getUserProfile);

// Update user profile (own profile)
router.put('/profile', updateUserProfile);

// Get user by ID
router.get('/:id', getUserProfile);

// Teacher only routes
router.get('/stats/teacher', teacherOnly, getTeacherStats);
router.get('/stats/student', getUserProfile, getStudentStats);

// Admin/Teacher only routes
router.get('/', teacherOnly, getAllUsers);
router.get('/students/stats', teacherOnly, getStudentsWithStats);

export default router;
