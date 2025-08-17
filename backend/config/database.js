
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Vercel uchun connection pool optimization
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Vercel'da connection'ni cache qilish
    if (cachedConnection) {
      console.log("✅ Using cached MongoDB connection");
      return cachedConnection;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1, // Vercel uchun minimal pool
      minPoolSize: 0, // Vercel uchun minimal pool
      maxIdleTimeMS: 10000, // 10 soniya
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    
    // Vercel'da error'ni throw qilmaslik
    if (process.env.NODE_ENV === 'production') {
      console.error("Production mode: Continuing without DB connection");
      return null;
    }
    
    process.exit(1);
  }
};

// Vercel uchun connection cleanup
export const closeConnection = async () => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log("🔌 MongoDB connection closed");
  }
};

export default connectDB;
