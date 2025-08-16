import express from "express"
import { register, login, getProfile } from "../controllers/authController.js"
import { validateRegister, validateLogin } from "../middleware/validation.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// @route   POST /api/auth/register
router.post("/register", validateRegister, register)

// @route   POST /api/auth/login
router.post("/login", validateLogin, login)

// @route   GET /api/auth/profile
router.get("/profile", protect, getProfile)

export default router
