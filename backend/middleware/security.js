import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
})

// General rate limiting - much more lenient
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute
  message: {
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 1
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Vercel proxy handling
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown'
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health' || req.path === '/'
  }
})

// More lenient rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 requests per 5 minutes
  message: {
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 5
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Vercel proxy handling
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown'
  }
})

// More lenient AI endpoints rate limiting
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: {
    message: 'Too many AI requests, please try again later.',
    retryAfter: 1
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Vercel proxy handling
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown'
  }
})

// Vercel production environment uchun rate limiting'ni o'chirish
export const productionGeneralLimiter = (req, res, next) => {
  // Production'da rate limiting o'chirilgan
  next()
}

export const productionAuthLimiter = (req, res, next) => {
  // Production'da rate limiting o'chirilgan
  next()
}

export const productionAiLimiter = (req, res, next) => {
  // Production'da rate limiting o'chirilgan
  next()
}
