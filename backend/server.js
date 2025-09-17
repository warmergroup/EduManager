import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { corsOptions } from "./config/cors.js";

// Routes
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import taskRoutes from "./routes/tasks.js";
import submissionRoutes from "./routes/submissions.js";
import videoRoutes from "./routes/videos.js";
import userRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import centerRoutes from "./routes/centers.js";
import groupRoutes from "./routes/groups.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlans.js";

const app = express();

// CORS middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  // Faqat production'da request logging
  if (process.env.NODE_ENV === 'production') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🎓 EduManager Backend API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
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
      ai: "/api/ai",
      analytics: "/api/analytics",
      centers: "/api/centers",
      groups: "/api/groups",
      subscriptionPlans: "/api/subscription-plans",
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    cors: "enabled"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/centers", centerRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/subscription-plans", subscriptionPlanRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await connectDB();
    
    if (!dbConnection) {
      console.warn("⚠️ Database connection failed, but server will continue");
    } else {
      console.log(`🔗 Database connected: ${dbConnection}`);
    }
    
    // Start server
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      const HOST = '0.0.0.0'; // Mobile qurilmalardan kirish uchun
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on ${HOST}:${PORT}`);
        console.log(`🔗 Database connected: ${dbConnection.connection.host}`);
      });
    } else {
      console.log(`🚀 Production server ready`);
    }
  } catch (error) {
    console.error("❌ Server startup error:", error);
    
    // Production'da server crash qilmaslik
    if (process.env.NODE_ENV === 'production') {
      console.log("🔄 Server will continue without database connection");
    } else {
      process.exit(1);
    }
  }
};

startServer();