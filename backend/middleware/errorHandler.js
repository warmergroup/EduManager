import logger from '../config/logger.js'

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error details with error handling
  try {
    logger.error('Error occurred', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id || 'unauthenticated',
      userRole: req.user?.role || 'none',
      ip: req.ip || req.connection.remoteAddress
    })
  } catch (loggerError) {
    // Fallback to console if logger fails
    console.error('❌ Logger error:', loggerError)
    console.error('❌ Original error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    })
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid ID format"
    error = { message, statusCode: 400 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `Duplicate field value entered for ${field}`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ")
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token"
    error = { message, statusCode: 401 }
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired"
    error = { message, statusCode: 401 }
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large. Maximum size is 10MB."
    error = { message, statusCode: 400 }
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected field name. Use 'file' as field name."
    error = { message, statusCode: 400 }
  }

  // CORS errors
  if (err.message && err.message.includes('Not allowed by CORS')) {
    const message = "CORS policy violation"
    error = { message, statusCode: 403 }
  }

  // OpenAI API errors
  if (err.code === "insufficient_quota") {
    const message = "AI service temporarily unavailable. Please try again later."
    error = { message, statusCode: 503 }
  }

  if (err.code === "rate_limit_exceeded") {
    const message = "Too many requests. Please wait a moment and try again."
    error = { message, statusCode: 429 }
  }

  // Default error
  const statusCode = error.statusCode || 500
  const message = error.message || "Server Error"

  // Don't expose internal errors in production
  const finalMessage = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal Server Error' 
    : message

  res.status(statusCode).json({
    success: false,
    message: finalMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
