import { Group } from '../models/Group.js'
import { User } from '../models/User.js'
import { EducationCenter } from '../models/EducationCenter.js'

// @desc    Create new group
// @route   POST /api/groups
// @access  Private (Teacher or Center Admin)
export const createGroup = async (req, res) => {
  try {
    const { name, description, subject, maxStudents, schedule, centerId } = req.body
    const teacherId = req.user.id

    // Check if teacher has permission to create groups
    const teacher = await User.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    // If centerId is provided, verify teacher belongs to that center
    if (centerId) {
      if (teacher.centerId?.toString() !== centerId) {
        return res.status(403).json({
          success: false,
          message: 'You can only create groups for your center'
        })
      }
    }

    // Check subscription limits
    const subscriptionPlan = await getSubscriptionPlan(teacher.subscriptionPlanId)
    if (centerId) {
      const center = await EducationCenter.findById(centerId)
      const centerGroups = await Group.countDocuments({ centerId })
      if (centerGroups >= subscriptionPlan.maxGroups) {
        return res.status(400).json({
          success: false,
          message: `Group limit reached. Maximum ${subscriptionPlan.maxGroups} groups allowed.`
        })
      }
    } else {
      const teacherGroups = await Group.countDocuments({ teacherId, centerId: null })
      if (teacherGroups >= subscriptionPlan.maxGroups) {
        return res.status(400).json({
          success: false,
          message: `Group limit reached. Maximum ${subscriptionPlan.maxGroups} groups allowed.`
        })
      }
    }

    const group = await Group.create({
      name,
      description,
      subject,
      maxStudents,
      schedule: schedule || [],
      teacherId,
      centerId: centerId || null
    })

    // Update center's groups array if centerId is provided
    if (centerId) {
      await EducationCenter.findByIdAndUpdate(centerId, {
        $push: { groups: group._id }
      })
    }

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating group',
      error: error.message
    })
  }
}

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
export const getAllGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', centerId, teacherId } = req.query
    const skip = (page - 1) * limit

    let query = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ]
    }

    if (centerId) {
      query.centerId = centerId
    }

    if (teacherId) {
      query.teacherId = teacherId
    }

    const groups = await Group.find(query)
      .populate('teacherId', 'fullName email')
      .populate('centerId', 'name')
      .populate('students', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Group.countDocuments(query)

    res.json({
      success: true,
      data: {
        groups,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching groups',
      error: error.message
    })
  }
}

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params

    const group = await Group.findById(id)
      .populate('teacherId', 'fullName email')
      .populate('centerId', 'name')
      .populate('students', 'fullName email')

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    res.json({
      success: true,
      data: { group }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching group',
      error: error.message
    })
  }
}

// @desc    Add student to group
// @route   POST /api/groups/:id/students
// @access  Private (Teacher or Center Admin)
export const addStudentToGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { studentEmail } = req.body

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    // Check if group is full
    if (group.currentStudents >= group.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Group is full'
      })
    }

    const student = await User.findOne({ email: studentEmail })
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'User is not a student'
      })
    }

    if (group.students.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Student already in this group'
      })
    }

    // Add student to group
    group.students.push(student._id)
    group.currentStudents += 1
    await group.save()

    res.json({
      success: true,
      message: 'Student added to group successfully',
      data: { student: { id: student._id, fullName: student.fullName, email: student.email } }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding student to group',
      error: error.message
    })
  }
}

// @desc    Remove student from group
// @route   DELETE /api/groups/:id/students/:studentId
// @access  Private (Teacher or Center Admin)
export const removeStudentFromGroup = async (req, res) => {
  try {
    const { id, studentId } = req.params

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    if (!group.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student not in this group'
      })
    }

    // Remove student from group
    group.students = group.students.filter(id => id.toString() !== studentId)
    group.currentStudents -= 1
    await group.save()

    res.json({
      success: true,
      message: 'Student removed from group successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing student from group',
      error: error.message
    })
  }
}

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private (Teacher or Center Admin)
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const group = await Group.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: { group }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating group',
      error: error.message
    })
  }
}

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private (Teacher or Center Admin)
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      })
    }

    // Remove group from center's groups array if it belongs to a center
    if (group.centerId) {
      await EducationCenter.findByIdAndUpdate(group.centerId, {
        $pull: { groups: group._id }
      })
    }

    await Group.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Group deleted successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting group',
      error: error.message
    })
  }
}

// Helper function to get subscription plan
async function getSubscriptionPlan(planId) {
  // This would typically fetch from database
  // For now, return default plan
  return {
    maxGroups: 3,
    maxStudents: 45
  }
}
