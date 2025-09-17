import { EducationCenter } from '../models/EducationCenter.js'
import { User } from '../models/User.js'
import { Group } from '../models/Group.js'

// @desc    Create new education center
// @route   POST /api/centers
// @access  Private (Super Admin only)
export const createCenter = async (req, res) => {
  try {
    const { name, description, address, phone, email, website, adminEmail, subscriptionPlanId } = req.body

    // Check if center already exists
    const existingCenter = await EducationCenter.findOne({ 
      $or: [{ name }, { email }] 
    })
    if (existingCenter) {
      return res.status(400).json({
        success: false,
        message: 'Center with this name or email already exists'
      })
    }

    // Find admin user
    const admin = await User.findOne({ email: adminEmail })
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      })
    }

    // Update admin role and center
    admin.role = 'center_admin'
    admin.centerId = null // Will be set after center creation
    await admin.save()

    // Calculate subscription expiry (1 year from now)
    const subscriptionExpiresAt = new Date()
    subscriptionExpiresAt.setFullYear(subscriptionExpiresAt.getFullYear() + 1)

    // Create center
    const center = await EducationCenter.create({
      name,
      description,
      address,
      phone,
      email,
      website,
      adminId: admin._id,
      subscriptionPlanId,
      subscriptionExpiresAt
    })

    // Update admin's centerId
    admin.centerId = center._id
    await admin.save()

    res.status(201).json({
      success: true,
      message: 'Education center created successfully',
      data: { center }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating education center',
      error: error.message
    })
  }
}

// @desc    Get all centers
// @route   GET /api/centers
// @access  Private (Super Admin only)
export const getAllCenters = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const skip = (page - 1) * limit

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const centers = await EducationCenter.find(query)
      .populate('adminId', 'fullName email')
      .populate('teachers', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await EducationCenter.countDocuments(query)

    res.json({
      success: true,
      data: {
        centers,
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
      message: 'Error fetching centers',
      error: error.message
    })
  }
}

// @desc    Get center by ID
// @route   GET /api/centers/:id
// @access  Private (Center Admin or Super Admin)
export const getCenterById = async (req, res) => {
  try {
    const { id } = req.params

    const center = await EducationCenter.findById(id)
      .populate('adminId', 'fullName email')
      .populate('teachers', 'fullName email role')
      .populate('groups', 'name subject teacherId currentStudents maxStudents')

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      })
    }

    res.json({
      success: true,
      data: { center }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching center',
      error: error.message
    })
  }
}

// @desc    Update center
// @route   PUT /api/centers/:id
// @access  Private (Center Admin or Super Admin)
export const updateCenter = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const center = await EducationCenter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      })
    }

    res.json({
      success: true,
      message: 'Center updated successfully',
      data: { center }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating center',
      error: error.message
    })
  }
}

// @desc    Add teacher to center
// @route   POST /api/centers/:id/teachers
// @access  Private (Center Admin or Super Admin)
export const addTeacherToCenter = async (req, res) => {
  try {
    const { id } = req.params
    const { teacherEmail } = req.body

    const center = await EducationCenter.findById(id)
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      })
    }

    const teacher = await User.findOne({ email: teacherEmail })
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    if (center.teachers.includes(teacher._id)) {
      return res.status(400).json({
        success: false,
        message: 'Teacher already added to this center'
      })
    }

    // Add teacher to center
    center.teachers.push(teacher._id)
    teacher.centerId = center._id
    await Promise.all([center.save(), teacher.save()])

    res.json({
      success: true,
      message: 'Teacher added to center successfully',
      data: { teacher: { id: teacher._id, fullName: teacher.fullName, email: teacher.email } }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding teacher to center',
      error: error.message
    })
  }
}

// @desc    Get center statistics
// @route   GET /api/centers/:id/stats
// @access  Private (Center Admin or Super Admin)
export const getCenterStats = async (req, res) => {
  try {
    const { id } = req.params

    const center = await EducationCenter.findById(id)
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      })
    }

    const stats = {
      totalTeachers: center.teachers.length,
      totalGroups: center.groups.length,
      totalStudents: 0,
      activeGroups: 0,
      subscriptionStatus: center.subscriptionExpiresAt > new Date() ? 'active' : 'expired'
    }

    // Calculate total students from groups
    const groups = await Group.find({ centerId: id })
    stats.totalStudents = groups.reduce((sum, group) => sum + group.currentStudents, 0)
    stats.activeGroups = groups.filter(group => group.isActive).length

    res.json({
      success: true,
      data: { stats }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching center statistics',
      error: error.message
    })
  }
}
