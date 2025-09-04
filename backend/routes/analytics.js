import express from 'express';
import { protect, teacherOnly } from '../middleware/auth.js';
import {
    getTaskAnalytics,
    getMonthlyActivity,
    getRecentTasks
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher only routes
router.get('/tasks', teacherOnly, getTaskAnalytics);
router.get('/monthly-activity', teacherOnly, getMonthlyActivity);
router.get('/recent-tasks', teacherOnly, getRecentTasks);

export default router;
