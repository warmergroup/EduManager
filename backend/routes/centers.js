import express from 'express'
import { protect, superAdminOnly, centerAdminOrSuperAdmin } from '../middleware/auth.js'
import {
  createCenter,
  getAllCenters,
  getCenterById,
  updateCenter,
  addTeacherToCenter,
  getCenterStats
} from '../controllers/centerController.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Super admin only routes
router.post('/', superAdminOnly, createCenter)
router.get('/', superAdminOnly, getAllCenters)

// Center admin or super admin routes
router.get('/:id', centerAdminOrSuperAdmin, getCenterById)
router.put('/:id', centerAdminOrSuperAdmin, updateCenter)
router.post('/:id/teachers', centerAdminOrSuperAdmin, addTeacherToCenter)
router.get('/:id/stats', centerAdminOrSuperAdmin, getCenterStats)

export default router
