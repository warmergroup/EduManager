import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      console.error("🔧 Please set MONGODB_URI in your environment variables");
      return null;
    }

    console.log("🔌 Connecting to MongoDB...");
    console.log("🌐 URI:", process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

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

    console.log("⚙️ Connection options:", JSON.stringify(options, null, 2));

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState}`);

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
      console.error("💡 Solutions:");
      console.error("   1. Verify MongoDB Atlas username/password");
      console.error("   2. Check if database user exists");
      console.error("   3. Verify network access settings");
    } else if (error.code === 'ENOTFOUND') {
      console.error("🌐 DNS resolution failed - Check connection string");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("⏰ Connection timeout - Check network/firewall");
    }
    
    return null;
  }
};

export default connectDB;
