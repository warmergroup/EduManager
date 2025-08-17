import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import logger from "../config/logger.js"

// Safe logger function that handles errors gracefully
const safeLog = (level, message, meta = {}) => {
  try {
    logger[level](message, meta)
  } catch (loggerError) {
    // Fallback to console if logger fails
    console.log(`[${level.toUpperCase()}] ${message}`, meta)
  }
}

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  })
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email, role } = req.body

    safeLog('info', 'User registration attempt', { email, role })

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      safeLog('warn', 'Registration failed - user already exists', { email })
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: req.body.password,
      role,
    })

    // Generate token
    const token = generateToken(user._id)

    safeLog('info', 'User registered successfully', { userId: user._id, email, role })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    safeLog('error', 'Registration error', { error: error.message, email: req.body.email })
    res.status(500).json({ message: "Server error during registration" })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email } = req.body

    safeLog('info', 'User login attempt', { email })

    // Check if user exists and include password for comparison
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      safeLog('warn', 'Login failed - user not found', { email })
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(req.body.password)
    if (!isPasswordValid) {
      safeLog('warn', 'Login failed - invalid password', { email })
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate token
    const token = generateToken(user._id)

    safeLog('info', 'User logged in successfully', { userId: user._id, email, role: user.role })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    safeLog('error', 'Login error', { error: error.message, email: req.body.email })
    res.status(500).json({ message: "Server error during login" })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    safeLog('info', 'Profile accessed', { userId: req.user.id })

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    safeLog('error', 'Get profile error', { error: error.message, userId: req.user.id })
    res.status(500).json({ message: "Server error" })
  }
}
