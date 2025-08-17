import logger from '../config/logger.js'

// Safe logger function that handles errors gracefully
const safeLog = (level, message, meta = {}) => {
  try {
    logger[level](message, meta)
  } catch (loggerError) {
    // Fallback to console if logger fails
    console.log(`[${level.toUpperCase()}] ${message}`, meta)
  }
}

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log request details
  safeLog('info', 'Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'unauthenticated',
    userRole: req.user?.role || 'none'
  })

  // Override res.end to log response details
  const originalEnd = res.end
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start
    
    safeLog('info', 'Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'unauthenticated',
      userRole: req.user?.role || 'none'
    })

    originalEnd.call(this, chunk, encoding)
  }

  next()
}

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  safeLog('error', 'Request error', {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
    userId: req.user?.id || 'unauthenticated',
    userRole: req.user?.role || 'none'
  })
  
  next(err)
}

// Performance monitoring middleware 
export const performanceLogger = (req, res, next) => {
  const start = process.hrtime()
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start)
    const duration = seconds * 1000 + nanoseconds / 1000000
    
    if (duration > 1000) { // Log slow requests (>1s)
      safeLog('warn', 'Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration.toFixed(2)}ms`,
        userId: req.user?.id || 'unauthenticated'
      })
    }
  })
  
  next()
}