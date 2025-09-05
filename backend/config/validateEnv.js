export const validateEnv = () => {
  // For development, only validate critical security variables
  if (process.env.NODE_ENV === 'development') {
    // console.log('⚠️ Development mode: Basic environment validation')
    
    // Only validate JWT_SECRET for security
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 20) {
      console.error('❌ JWT_SECRET must be at least 20 characters long for security')
      console.error('Please set JWT_SECRET in your .env file')
      process.exit(1)
    }
    
    // console.log('✅ Basic validation passed for development')
    return
  }

  // Production mode - strict validation
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
    'APPWRITE_BUCKET_ID',
    'OPENAI_API_KEY'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error('Please check your .env file and ensure all required variables are set.')
    process.exit(1)
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security')
    process.exit(1)
  }

  // Validate MongoDB URI format
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://')
    process.exit(1)
  }

  // console.log('✅ Environment variables validation passed')
}


