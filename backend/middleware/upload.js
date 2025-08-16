import multer from "multer"
import path from "path"

// Configure multer for memory storage
const storage = multer.memoryStorage()

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/msword", // DOC
    "image/jpeg", // JPG
    "image/jpg", // JPG
    "image/png", // PNG
  ]

  // Check file type
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, DOC, JPG, and PNG files are allowed."), false)
  }
}

// Configure multer 
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 10MB." })
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected field name. Use 'file' as field name." })
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({ message: error.message })
  }

  next(error)
}
