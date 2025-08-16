import {body, validationResult} from "express-validator"

// Check validation results
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// User registration validation
export const validateRegister = [
  body("fullName").trim().isLength({ min: 2, max: 50 }).withMessage("Full name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role").isIn(["student", "teacher"]).withMessage("Role must be either student or teacher"),
  checkValidation,
]

// User login validation
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  checkValidation,
]

// Task validation
export const validateTask = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("deadline").isISO8601().withMessage("Please provide a valid deadline date"),
  checkValidation,
]

// Video validation
export const validateVideo = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
  body("url").isURL().withMessage("Please provide a valid YouTube URL"),
  checkValidation,
]
