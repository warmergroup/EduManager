import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      return null;
    }

    console.log("🔌 Connecting to MongoDB...");

    // MongoDB Atlas uchun maxsus sozlamalar
    const options = {
      // Connection options
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      
      // Authentication options
      // authSource: 'admin',
      retryWrites: true,
      w: 'majority',
      
      // Vercel uchun
      // bufferCommands: false,
      // bufferMaxEntries: 0
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    
    // Detailed error analysis
    if (error.code === 8000) {
      console.error("🔐 Authentication failed - Check username/password");
    } else if (error.code === 'ENOTFOUND') {
      console.error("🌐 DNS resolution failed - Check connection string");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("⏰ Connection timeout - Check network/firewall");
    }
    
    return null;
  }
};

export default connectDB;
