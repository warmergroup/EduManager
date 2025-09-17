import express from 'express'
import { protect, superAdminOnly } from '../middleware/auth.js'
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
} from '../controllers/subscriptionPlanController.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Get all plans (public for authenticated users)
router.get('/', getAllPlans)

// Get plan by ID
router.get('/:id', getPlanById)

// Super admin only routes
router.post('/', superAdminOnly, createPlan)
router.put('/:id', superAdminOnly, updatePlan)
router.delete('/:id', superAdminOnly, deletePlan)

export default router
