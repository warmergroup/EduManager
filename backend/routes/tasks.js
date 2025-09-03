import express from 'express'
import { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats, upload } from '../controllers/taskController.js'
import { protect, teacherOnly } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', protect, getTasks)

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, getTaskById)

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Teacher only)
router.post('/', protect, teacherOnly, upload.single('file'), createTask)

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Teacher only - own tasks)
router.put('/:id', protect, teacherOnly, upload.single('file'), updateTask)

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Teacher only - own tasks)
router.delete('/:id', protect, teacherOnly, deleteTask)

// @route   GET /api/tasks/:id/stats
// @desc    Get task statistics
// @access  Private (Teacher only - own tasks)
router.get('/:id/stats', protect, teacherOnly, getTaskStats)

// @route   GET /api/tasks/:id/file/:fileId
// @desc    Download task file
// @access  Private
router.get('/:id/file/:fileId', protect, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Appwrite'dan fayl ma'lumotlarini olish
    const fileService = (await import('../services/fileService.js')).default;
    const fileInfo = await fileService.getFileInfo(fileId);
    
    if (!fileInfo.success) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Faylni yuklab olish uchun redirect
    res.redirect(fileInfo.file.url);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
});

export default router
