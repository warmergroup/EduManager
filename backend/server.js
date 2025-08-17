import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders, generalLimiter, authLimiter, aiLimiter } from "./middleware/security.js";
import { corsOptions } from "./config/cors.js";
import { validateEnv } from "./config/validateEnv.js";

// Vercel uchun serverless function
const app = express();

// Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "EduManager API is running",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authLimiter, (await import("./routes/auth.js")).default);
app.use("/api/ai", aiLimiter, (await import("./routes/ai.js")).default);
app.use("/api/tasks", (await import("./routes/tasks.js")).default);
app.use("/api/submissions", (await import("./routes/submissions.js")).default);
app.use("/api/videos", (await import("./routes/videos.js")).default);
app.use("/api/users", (await import("./routes/users.js")).default);

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
