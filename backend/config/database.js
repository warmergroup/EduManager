
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Vercel uchun connection pool optimization
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      return null;
    }

    // Vercel'da connection'ni cache qilish
    if (cachedConnection && cachedConnection.readyState === 1) {
      console.log("✅ Using cached MongoDB connection");
      return cachedConnection;
    }

    // Close existing connection if it's not ready
    if (cachedConnection) {
      try {
        await mongoose.disconnect();
      } catch (error) {
        console.error("❌ Error disconnecting:", error);
      }
      cachedConnection = null;
    }

    console.log("🔌 Connecting to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1, // Vercel uchun minimal pool
      minPoolSize: 0, // Vercel uchun minimal pool
      maxIdleTimeMS: 30000, // 30 soniya
      serverSelectionTimeoutMS: 30000, // 30 soniya
      socketTimeoutMS: 60000, // 60 soniya
      connectTimeoutMS: 30000, // 30 soniya
      retryWrites: true,
      retryReads: true,
      bufferCommands: false, // Vercel uchun
      // Vercel uchun qo'shimcha optimizatsiya
      maxConnecting: 1,
      serverApi: {
        version: '1',
        strict: false,
        deprecationErrors: false,
      }
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
    try {
      await mongoose.disconnect();
      cachedConnection = null;
      console.log("🔌 MongoDB connection closed");
    } catch (error) {
      console.error("❌ Error closing connection:", error);
    }
  }
};

// Vercel uchun connection status check
export const isConnected = () => {
  // Check both cached connection and mongoose default connection
  const hasCachedConnection = cachedConnection && cachedConnection.readyState === 1;
  const hasMongooseConnection = mongoose.connection.readyState === 1;
  
  console.log('🔍 Connection check:', {
    cachedConnection: cachedConnection?.readyState,
    mongooseConnection: mongoose.connection.readyState,
    hasCachedConnection,
    hasMongooseConnection
  });
  
  return hasCachedConnection || hasMongooseConnection;
};

// Vercel uchun connection test
export const testConnection = async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      return { success: true, message: "Database connected" };
    } else {
      return { success: false, message: "Database connection failed" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default connectDB;
