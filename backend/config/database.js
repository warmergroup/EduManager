
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      return null;
    }

    console.log("🔌 Connecting to MongoDB...");
    
    // Vercel serverless environment uchun optimize qilingan options
    const options = {
      // Connection pool optimization for Vercel
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      
      // Timeout settings for Vercel
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      
      // Buffer settings for Vercel
      bufferCommands: false,
      // bufferMaxEntries: 0,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Server API version
      serverApi: {
        version: '1',
        strict: false,
        deprecationErrors: false,
      },
      
      // Vercel uchun qo'shimcha optimizatsiya
      maxConnecting: 1,
      heartbeatFrequencyMS: 30000,
      minHeartbeatFrequencyMS: 10000,
    };
    
    // Connection string'ni optimize qilish
    let mongoUri = process.env.MONGODB_URI;
    
    // Agar connection string'da parametrlar yo'q bo'lsa, ularni qo'shish
    if (!mongoUri.includes('retryWrites')) {
      mongoUri += (mongoUri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
    }
    
    if (!mongoUri.includes('maxPoolSize')) {
      mongoUri += (mongoUri.includes('?') ? '&' : '?') + 'maxPoolSize=1&minPoolSize=0';
    }
    
    console.log('🔗 Optimized MongoDB URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.error("❌ Error details:", error);
    
    // Network access muammosi uchun specific error handling
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error("🌐 Network Access Issue Detected!");
      console.error("📋 MongoDB Atlas'da quyidagilarni tekshiring:");
      console.error("   1. Security → Network Access");
      console.error("   2. IP Address → ADD IP ADDRESS");
      console.error("   3. 0.0.0.0/0 qo'shing (barcha IP'lardan ruxsat)");
      console.error("   4. Vercel IP ranges qo'shing:");
      console.error("      - 76.76.19.0/24");
      console.error("      - 76.76.20.0/24");
      console.error("      - 76.76.21.0/24");
      console.error("      - 76.76.22.0/24");
    }
    
    if (error.message.includes('buffering timed out')) {
      console.error("⏰ MongoDB Connection Timeout!");
      console.error("📋 Vercel serverless environment'da connection sekin bo'lishi mumkin");
      console.error("   1. Network Access → 0.0.0.0/0 qo'shing");
      console.error("   2. Connection string'da timeout parametrlarini tekshiring");
    }
    
    return null;
  }
};

export default connectDB;
