import { Video } from "../models/Video.js"

// @desc    Get all video lessons
// @route   GET /api/videos
// @access  Private
export const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query

    // Build search query
    let query = {}
    if (search) {
      query = {
        $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Video.countDocuments(query)

    // Get videos with creator info
    const videos = await Video.find(query)
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalVideos: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get videos error:", error)
    res.status(500).json({ message: "Server error while fetching videos" })
  }
}

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("createdBy", "fullName email")

    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    res.json({
      success: true,
      data: { video },
    })
  } catch (error) {
    console.error("Get video by ID error:", error)
    res.status(500).json({ message: "Server error while fetching video" })
  }
}

// @desc    Add new video lesson
// @route   POST /api/videos
// @access  Private (Teacher only)
export const addVideo = async (req, res) => {
  try {
    const { title, url, description } = req.body

    // Extract YouTube video ID and create embed URL
    let embedUrl = url
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(youtubeRegex)

    if (match && match[1]) {
      embedUrl = `https://www.youtube.com/embed/${match[1]}`
    }

    const video = await Video.create({
      title,
      url: embedUrl,
      description: description || "",
      createdBy: req.user.id,
    })

    // Populate creator info
    await video.populate("createdBy", "fullName email")

    res.status(201).json({
      success: true,
      message: "Video lesson added successfully",
      data: { video },
    })
  } catch (error) {
    console.error("Add video error:", error)
    res.status(500).json({ message: "Server error while adding video" })
  }
}

// @desc    Update video lesson
// @route   PUT /api/videos/:id
// @access  Private (Teacher only - own videos)
export const updateVideo = async (req, res) => {
  try {
    const { title, url, description } = req.body

    // Find video and check ownership
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    // Check if the teacher owns this video
    if (video.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this video" })
    }

    // Extract YouTube video ID and create embed URL
    let embedUrl = url
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(youtubeRegex)

    if (match && match[1]) {
      embedUrl = `https://www.youtube.com/embed/${match[1]}`
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        url: embedUrl,
        description: description || "",
      },
      { new: true, runValidators: true },
    ).populate("createdBy", "fullName email")

    res.json({
      success: true,
      message: "Video lesson updated successfully",
      data: { video: updatedVideo },
    })
  } catch (error) {
    console.error("Update video error:", error)
    res.status(500).json({ message: "Server error while updating video" })
  }
}

// @desc    Delete video lesson
// @route   DELETE /api/videos/:id
// @access  Private (Teacher only - own videos)
export const deleteVideo = async (req, res) => {
  try {
    // Find video and check ownership
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    // Check if the teacher owns this video
    if (video.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this video" })
    }

    // Delete the video
    await Video.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Video lesson deleted successfully",
    })
  } catch (error) {
    console.error("Delete video error:", error)
    res.status(500).json({ message: "Server error while deleting video" })
  }
}

// @desc    Get videos by teacher
// @route   GET /api/videos/teacher/my-videos
// @access  Private (Teacher only)
export const getMyVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Video.countDocuments({ createdBy: req.user.id })

    // Get teacher's videos
    const videos = await Video.find({ createdBy: req.user.id })
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalVideos: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get my videos error:", error)
    res.status(500).json({ message: "Server error while fetching your videos" })
  }
}

// @desc    Get video statistics for teacher
// @route   GET /api/videos/stats
// @access  Private (Teacher only)
export const getVideoStats = async (req, res) => {
  try {
    // Get total videos created by teacher
    const totalVideos = await Video.countDocuments({ createdBy: req.user.id })

    // Get videos created in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentVideos = await Video.countDocuments({
      createdBy: req.user.id,
      createdAt: { $gte: thirtyDaysAgo },
    })

    res.json({
      success: true,
      data: {
        statistics: {
          totalVideos,
          recentVideos,
          videosThisMonth: recentVideos,
        },
      },
    })
  } catch (error) {
    console.error("Get video stats error:", error)
    res.status(500).json({ message: "Server error while fetching video statistics" })
  }
}
