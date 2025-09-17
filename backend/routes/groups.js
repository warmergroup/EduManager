import express from 'express'
import { protect, teacherOrCenterAdmin } from '../middleware/auth.js'
import {
  createGroup,
  getAllGroups,
  getGroupById,
  addStudentToGroup,
  removeStudentFromGroup,
  updateGroup,
  deleteGroup
} from '../controllers/groupController.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Teacher or center admin routes
router.post('/', teacherOrCenterAdmin, createGroup)
router.get('/', getAllGroups)
router.get('/:id', getGroupById)
router.post('/:id/students', teacherOrCenterAdmin, addStudentToGroup)
router.delete('/:id/students/:studentId', teacherOrCenterAdmin, removeStudentFromGroup)
router.put('/:id', teacherOrCenterAdmin, updateGroup)
router.delete('/:id', teacherOrCenterAdmin, deleteGroup)

export default router
