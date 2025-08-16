import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import {connectDB} from "./config/database.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { securityHeaders, generalLimiter, authLimiter, aiLimiter } from "./middleware/security.js"
import { corsOptions } from "./config/cors.js"
import { validateEnv } from "./config/validateEnv.js"

validateEnv()

// Connect to MongoDB
connectDB()

const app = express()

// Security middleware
app.use(securityHeaders)

// CORS configuration
app.use(cors(corsOptions))

// Rate limiting
app.use(generalLimiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running successfully!",
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  })
})

// Apply specific rate limiting to routes
app.use("/api/auth", authLimiter, (await import("./routes/auth.js")).default)
app.use("/api/ai", aiLimiter, (await import("./routes/ai.js")).default)

// Regular routes
app.use("/api/tasks", (await import("./routes/tasks.js")).default)
app.use("/api/submissions", (await import("./routes/submissions.js")).default)
app.use("/api/videos", (await import("./routes/videos.js")).default)
app.use("/api/users", (await import("./routes/users.js")).default)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})
