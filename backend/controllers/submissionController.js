
import { storage } from '../config/appwrite.js'
import { ID } from "node-appwrite"
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

    // Generate unique file name
    const fileExtension = req.file.originalname.split(".").pop()
    const fileName = `${req.user.id}_${taskId}_${Date.now()}.${fileExtension}`

    // Upload file to Appwrite Storage
    const fileUpload = await storage.createFile(process.env.APPWRITE_BUCKET_ID, ID.unique(), req.file.buffer, [
      // Set file permissions - only the uploader can read
      `read("user:${req.user.id}")`,
      // Teachers can also read the file
      'read("role:teacher")',
    ])

    // Get file URL
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileUpload.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`

    // Create submission record
    const submission = await Submission.create({
      taskId,
      studentId: req.user.id,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
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
    console.error("Submit assignment error:", error)
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
      data: { submissions }
    })
  } catch (error) {
    console.error('Get all submissions error:', error)
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
    console.error("Get submissions error:", error)
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
    console.error("Get submission by ID error:", error)
    res.status(500).json({ message: "Server error while fetching submission" })
  }
}

// Grade a submission
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback } = req.body;
        const teacherId = req.user.id;

        // Validate input
        if (!score || score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: 'Score must be between 0 and 100'
            });
        }

        if (!feedback || feedback.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Feedback is required'
            });
        }

        // Find submission and check if it exists
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check if teacher is grading their own submission (shouldn't happen)
        if (submission.studentId.toString() === teacherId) {
            return res.status(403).json({
                success: false,
                message: 'Teachers cannot grade their own submissions'
            });
        }

        // Update submission with grade
        submission.score = score;
        submission.feedback = feedback;
        submission.gradedBy = teacherId;
        submission.gradedAt = new Date();
        submission.isGraded = true;

        await submission.save();

        res.json({
            success: true,
            message: 'Submission graded successfully',
            data: {
                submission: {
                    id: submission._id,
                    score: submission.score,
                    feedback: submission.feedback,
                    gradedAt: submission.gradedAt,
                    isGraded: submission.isGraded
                }
            }
        });

    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
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
    console.error("Get student progress error:", error)
    res.status(500).json({ message: "Server error while fetching progress" })
  }
}

