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

// ✅ CORS middleware (faqat bitta)
app.use(cors(corsOptions));

// ✅ Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Request logger (faqat production’da)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🎓 EduManager Backend API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// ✅ Root endpoint
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
    cors: "enabled",
  });
});

// ✅ API routes
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

// ✅ Error handling
app.use(errorHandler);

// ✅ 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0";

  connectDB()
    .then(() => {
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    });
} else {
  // Production’da Vercel serverless sifatida ishlaydi
  connectDB()
    .then(() => {
      console.log("🚀 Production server ready, DB connected");
    })
    .catch((err) => {
      console.error("⚠️ DB connection failed in production:", err.message);
    });
}

// ✅ Vercel uchun export
export default app;
