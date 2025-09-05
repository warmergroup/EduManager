import { Task } from '../models/Task.js';
import { Submission } from '../models/Submission.js';
import { Video } from '../models/Video.js';
import mongoose from 'mongoose';

// Get task analytics with completion rates
export const getTaskAnalytics = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Get tasks with submission counts and completion rates
        const tasks = await Task.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(teacherId) } },
            {
                $lookup: {
                    from: 'submissions',
                    localField: '_id',
                    foreignField: 'taskId',
                    as: 'submissions'
                }
            },
            {
                $addFields: {
                    submissionCount: { $size: '$submissions' },
                    completionRate: {
                        $cond: {
                            if: { $gt: [{ $size: '$submissions' }, 0] },
                            then: {
                                $multiply: [
                                    { $divide: [{ $size: '$submissions' }, 10] }, // Assuming 10 students max
                                    100
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            data: { tasks }
        });

    } catch (error) {
            res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get monthly activity data
export const getMonthlyActivity = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        // Get monthly activity based on task creation and video uploads
        const monthlyData = await Task.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(teacherId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    taskCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Get video uploads for the same period
        const videoData = await Video.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(teacherId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    videoCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Combine and format data
        const monthNames = [
            'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
            'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
        ];

        const activityMap = new Map();
        
        // Process task data
        monthlyData.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            activityMap.set(key, {
                month: monthNames[item._id.month - 1],
                activity: Math.min(item.taskCount * 10, 100) // Scale to percentage
            });
        });

        // Process video data
        videoData.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            const existing = activityMap.get(key);
            if (existing) {
                existing.activity = Math.min(existing.activity + (item.videoCount * 5), 100);
            } else {
                activityMap.set(key, {
                    month: monthNames[item._id.month - 1],
                    activity: Math.min(item.videoCount * 5, 100)
                });
            }
        });

        const monthlyActivity = Array.from(activityMap.values())
            .sort((a, b) => {
                const monthA = monthNames.indexOf(a.month);
                const monthB = monthNames.indexOf(b.month);
                return monthA - monthB;
            })
            .slice(-4); // Get last 4 months

        res.json({
            success: true,
            data: { monthlyActivity }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get recent tasks with basic info
export const getRecentTasks = async (req, res) => {
    try {
        const teacherId = req.user.id;

        const recentTasks = await Task.find({ createdBy: teacherId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title createdAt')
            .lean();

        res.json({
            success: true,
            data: { recentTasks }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
