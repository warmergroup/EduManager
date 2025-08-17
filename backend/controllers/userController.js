import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { Task } from '../models/Task.js';
import { Video } from '../models/Video.js';

// Get all users (for teachers)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-passwordHash');
        
        res.json({
            success: true,
            data: { users }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user.id;
        
        const user = await User.findById(userId, '-passwordHash');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { fullName, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic info
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;

        // Update password if provided
        if (newPassword && currentPassword) {
            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            user.password = newPassword;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get teacher statistics
export const getTeacherStats = async (req, res) => {
    try {
        const teacherId = req.user.id;

        const [totalTasks, totalVideos, totalSubmissions, gradedSubmissions, averageScoreResult, totalStudents] = await Promise.all([
            Task.countDocuments({ createdBy: teacherId }),
            Video.countDocuments({ createdBy: teacherId }),
            Submission.countDocuments({ 
                taskId: { $in: await Task.find({ createdBy: teacherId }).select('_id') }
            }),
            Submission.countDocuments({ 
                taskId: { $in: await Task.find({ createdBy: teacherId }).select('_id') },
                isGraded: true
            }),
            Submission.aggregate([
                { 
                    $lookup: {
                        from: 'tasks',
                        localField: 'taskId',
                        foreignField: '_id',
                        as: 'task'
                    }
                },
                { $match: { 'task.createdBy': teacherId, isGraded: true } },
                { $group: { _id: null, avgScore: { $avg: '$score' } } }
            ]),
            User.countDocuments({ role: 'student' })
        ]);

        const averageScore = averageScoreResult.length > 0 ? Math.round(averageScoreResult[0].avgScore) : 0;

        res.json({
            success: true,
            data: {
                stats: {
                    totalTasks,
                    totalVideos,
                    totalSubmissions,
                    gradedSubmissions,
                    averageScore,
                    totalStudents
                }
            }
        });

    } catch (error) {
        console.error('Get teacher stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get student statistics
export const getStudentStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [totalTasks, submittedTasks, pendingGrades, averageScore] = await Promise.all([
            Task.countDocuments(),
            Submission.countDocuments({ studentId }),
            Submission.countDocuments({ studentId, isGraded: false }),
            Submission.aggregate([
                { $match: { studentId: studentId, isGraded: true } },
                { $group: { _id: null, avgScore: { $avg: '$score' } } }
            ])
        ]);

        const avgScore = averageScore.length > 0 ? Math.round(averageScore[0].avgScore) : 0;
        const completionPercentage = totalTasks > 0 ? Math.round((submittedTasks / totalTasks) * 100) : 0;

        res.json({
            success: true,
            data: {
                stats: {
                    totalTasks,
                    submittedTasks,
                    pendingGrades,
                    averageScore: avgScore,
                    completionPercentage
                }
            }
        });

    } catch (error) {
        console.error('Get student stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
