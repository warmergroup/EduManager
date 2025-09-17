import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

// Verify JWT token (alias: protect)
export const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Alias for backward compatibility
export const auth = protect

// Check if user is super admin
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Super admin role required." })
  }
}

// Check if user is center admin or super admin
export const centerAdminOrSuperAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "center_admin" || req.user.role === "super_admin")) {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Center admin or super admin role required." })
  }
}

// Check if user is teacher or center admin
export const teacherOrCenterAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "teacher" || req.user.role === "center_admin" || req.user.role === "super_admin")) {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Teacher or center admin role required." })
  }
}

// Check if user is teacher (alias: teacherOnly)
export const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Teacher role required." })
  }
}

// Alias for backward compatibility
export const isTeacher = teacherOnly

// Check if user is student
export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Student role required." })
  }
}