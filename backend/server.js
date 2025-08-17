import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders, generalLimiter, authLimiter, aiLimiter } from "./middleware/security.js";
import { corsOptions } from "./config/cors.js";
import { validateEnv } from "./config/validateEnv.js";

// Import routes statically
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import taskRoutes from "./routes/tasks.js";
import submissionRoutes from "./routes/submissions.js";
import videoRoutes from "./routes/videos.js";
import userRoutes from "./routes/users.js";

// Vercel uchun serverless function
const app = express();

// Trust Vercel proxy for rate limiting
app.set('trust proxy', 1);

// Basic error handling for Vercel
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware with error handling
try {
  app.use(securityHeaders);
  app.use(cors(corsOptions));
  app.use(generalLimiter);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
} catch (error) {
  console.error('❌ Middleware setup error:', error);
}

// Health check
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    let dbStatus = "Not tested";
    try {
      const { testConnection } = await import("./config/database.js");
      const dbTest = await testConnection();
      dbStatus = dbTest.success ? "Connected" : "Failed";
    } catch (error) {
      dbStatus = "Error: " + error.message;
    }

    res.json({ 
      success: true, 
      message: "EduManager API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      mongodb_uri: process.env.MONGODB_URI ? "Set" : "Not set"
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Health check failed",
      error: error.message 
    });
  }
});

// Root endpoint
app.get("/", async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: "🎓 EduManager Backend API",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        tasks: "/api/tasks",
        submissions: "/api/submissions",
        videos: "/api/videos",
        users: "/api/users",
        ai: "/api/ai"
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Root endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Root endpoint failed",
      error: error.message 
    });
  }
});

// API info endpoint
app.get("/api", async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: "EduManager API Endpoints",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        tasks: "/api/tasks",
        submissions: "/api/submissions",
        videos: "/api/videos",
        users: "/api/users",
        ai: "/api/ai"
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ API info error:', error);
    res.status(500).json({ 
      success: false, 
      message: "API info failed",
      error: error.message 
    });
  }
});

// API Routes with error handling
try {
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/ai", aiLimiter, aiRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/submissions", submissionRoutes);
  app.use("/api/videos", videoRoutes);
  app.use("/api/users", userRoutes);
} catch (error) {
  console.error('❌ Routes setup error:', error);
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Vercel uchun export
export default app;

// Development uchun server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  const startServer = async () => {
    try {
      // Validate environment variables
      validateEnv();
      
      // Connect to database (only in development)
      await connectDB();
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      });
    } catch (error) {
      console.error("❌ Server startup error:", error);
      process.exit(1);
    }
  };

  startServer();
}
