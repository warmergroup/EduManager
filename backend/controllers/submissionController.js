
import { Submission } from '../models/Submission.js'
import { Task } from '../models/Task.js'
import mongoose from 'mongoose'

// @desc    Submit assignment file
// @route   POST /api/submissions/:taskId
// @access  Private (Student only)
export const submitAssignment = async (req, res) => {
  try {
    const { taskId } = req.params

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Check if task exists
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if deadline has passed
    if (new Date() > task.deadline) {
      return res.status(400).json({ message: "Submission deadline has passed" })
    }

    // Check if student already submitted for this task
    const existingSubmission = await Submission.findOne({
      taskId,
      studentId: req.user.id,
    })

    if (existingSubmission) {
      return res.status(400).json({ message: "You have already submitted for this task" })
    }

    // FileService orqali faylni yuklash
    const fileService = (await import('../services/fileService.js')).default
    const uploadResult = await fileService.uploadFile(req.file, 'submissions')

    if (!uploadResult.success) {
      return res.status(500).json({ 
        message: "File upload failed", 
        error: uploadResult.error 
      })
    }

    // Create submission record
    const submission = await Submission.create({
      taskId,
      studentId: req.user.id,
      fileUrl: uploadResult.fileUrl,
      fileName: uploadResult.fileName,
      originalName: uploadResult.originalName,
      fileId: uploadResult.fileId,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
    })

    // Populate task and student info
    await submission.populate([
      { path: "taskId", select: "title description deadline" },
      { path: "studentId", select: "fullName email" },
    ])

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: { submission },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error while submitting assignment" })
  }
}

// @desc    Get all submissions (for teachers)
// @route   GET /api/submissions
// @access  Private (Teacher only)
export const getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const query = {}
    
    // Filter by status if provided
    if (status === 'graded') {
      query.score = { $exists: true, $ne: null }
    } else if (status === 'pending') {
      query.score = { $exists: false }
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'taskId', select: 'title description deadline' },
        { path: 'studentId', select: 'fullName email' }
      ],
      sort: { createdAt: -1 }
    }
    
    const submissions = await Submission.paginate(query, options)
    
    res.json({
      success: true,
      message: 'Submissions retrieved successfully',
      data: { 
        submissions: submissions.docs,
        pagination: {
          page: submissions.page,
          limit: submissions.limit,
          total: submissions.totalDocs,
          pages: submissions.totalPages
        }
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching submissions' 
    })
  }
}

// @desc    Get submissions for a task
// @route   GET /api/submissions/:taskId
// @access  Private
export const getSubmissions = async (req, res) => {
  try {
    const { taskId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Check if task exists
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    const query = { taskId }

    // If user is a student, only show their own submission
    if (req.user.role === "student") {
      query.studentId = req.user.id
    }
    // If user is a teacher, check if they created the task
    else if (req.user.role === "teacher" && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view submissions for this task" })
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Submission.countDocuments(query)

    // Get submissions
    const submissions = await Submission.find(query)
      .populate("studentId", "fullName email")
      .populate("taskId", "title description deadline")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalSubmissions: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching submissions" })
  }
}

// @desc    Get single submission by ID
// @route   GET /api/submissions/single/:submissionId
// @access  Private
export const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params

    const submission = await Submission.findById(submissionId)
      .populate("studentId", "fullName email")
      .populate("taskId", "title description deadline createdBy")

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Check authorization
    const isStudent = req.user.role === "student" && submission.studentId._id.toString() === req.user.id
    const isTaskCreator = req.user.role === "teacher" && submission.taskId.createdBy.toString() === req.user.id

    if (!isStudent && !isTaskCreator) {
      return res.status(403).json({ message: "Not authorized to view this submission" })
    }

    res.json({
      success: true,
      data: { submission },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching submission" })
  }
}

// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Teacher only)
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    // Validate score
    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: "Score is required"
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be between 0 and 100"
      });
    }

    // Find submission and check if it exists
    const submission = await Submission.findById(submissionId)
      .populate('taskId', 'title createdBy')
      .populate('studentId', 'fullName email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    // Check if the teacher owns the task
    if (submission.taskId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only grade submissions for your own tasks"
      });
    }

    // Update submission with grade and feedback
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        score,
        feedback: feedback || "",
        isGraded: true,
        gradedAt: new Date(),
        gradedBy: req.user.id
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'taskId', select: 'title description deadline' },
      { path: 'studentId', select: 'fullName email' }
    ]);

    res.json({
      success: true,
      message: "Submission graded successfully",
      data: { submission: updatedSubmission }
    });

  } catch (error) {
    // console.error("Grade submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while grading submission"
    });
  }
};

// @desc    Get student progress
// @route   GET /api/submissions/progress
// @access  Private (Student only)
export const getStudentProgress = async (req, res) => {
  try {
    // Get total tasks
    const totalTasks = await Task.countDocuments()

    // Get student's submissions
    const studentSubmissions = await Submission.countDocuments({ studentId: req.user.id })

    // Get graded submissions
    const gradedSubmissions = await Submission.countDocuments({
      studentId: req.user.id,
      isGraded: true,
    })

    // Calculate average score
    const { ObjectId } = mongoose.Types
    const avgScoreResult = await Submission.aggregate([
      { $match: { 
        studentId: new ObjectId(req.user.id), 
        isGraded: true, 
        score: { $ne: null } 
      } },
      { $group: { _id: null, averageScore: { $avg: "$score" } } },
    ])

    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].averageScore * 100) / 100 : 0

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 ? Math.round((studentSubmissions / totalTasks) * 100) : 0

    res.json({
      success: true,
      data: {
        progress: {
          totalTasks,
          submittedTasks: studentSubmissions,
          gradedTasks: gradedSubmissions,
          pendingGrades: studentSubmissions - gradedSubmissions,
          completionPercentage,
          averageScore,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching progress" })
  }
}



// @desc    Get student's own submissions
// @route   GET /api/submissions/student/my-submissions
// @access  Private (Student only)
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate('taskId', 'title description deadline')
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: {
        submissions: submissions.map(submission => ({
          _id: submission._id,
          taskId: submission.taskId,
          studentId: submission.studentId,
          fileUrl: submission.fileUrl,
          fileName: submission.fileName,
          originalName: submission.originalName,
          fileId: submission.fileId,
          fileSize: submission.fileSize,
          mimeType: submission.mimeType,
          score: submission.score,
          feedback: submission.feedback,
          submittedAt: submission.createdAt,
          gradedAt: submission.gradedAt,
          isGraded: submission.score !== null && submission.score !== undefined
        }))
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch my submissions',
      error: error.message
    })
  }
}
