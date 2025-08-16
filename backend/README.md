# Student Assignment Management Backend

A complete Node.js backend API for managing student assignments with file uploads, grading, and AI integration.

## ✨ Features

- 🔐 JWT Authentication with role-based access (Student/Teacher)
- 📝 Task management (CRUD operations)
- 📁 File upload to Appwrite Storage
- 📊 Grading system with feedback
- 🎥 Video lessons management
- 🤖 AI integration for chat assistance and task generation
- 🗄️ MongoDB with Mongoose ODM
- ✅ Input validation and error handling
- 🛡️ Enhanced security with Helmet.js
- 🚦 Rate limiting for API protection
- 📝 Comprehensive logging with Winston
- 🔄 Database connection pooling and retry logic
- 🌐 Configurable CORS settings

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **File Storage**: Appwrite SDK
- **Authentication**: JWT
- **AI Integration**: OpenAI API
- **Security**: Helmet.js, Rate Limiting
- **Logging**: Winston
- **Validation**: Express-validator
- **CORS**: Configurable for Vue 3 frontend

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-assignment-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```

4. **Update the `.env` file** with your credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/student-assignment-db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=30d
   
   # Appwrite Configuration
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_API_KEY=your-api-key
   APPWRITE_BUCKET_ID=your-bucket-id
   
   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prod` - Start production server with NODE_ENV=production
- `npm run logs` - View combined logs
- `npm run logs:error` - View error logs only

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination and search)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (Teacher only)
- `PUT /api/tasks/:id` - Update task (Teacher only)
- `DELETE /api/tasks/:id` - Delete task (Teacher only)
- `GET /api/tasks/:id/stats` - Get task statistics

### Submissions
- `POST /api/submissions/:taskId` - Submit assignment (Student only)
- `GET /api/submissions/:taskId` - Get submissions for task
- `GET /api/submissions/single/:submissionId` - Get single submission
- `PUT /api/submissions/:submissionId/grade` - Grade submission (Teacher only)
- `GET /api/submissions/progress` - Get student progress

### Videos
- `GET /api/videos` - Get all video lessons
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Add video lesson (Teacher only)
- `PUT /api/videos/:id` - Update video (Teacher only)
- `DELETE /api/videos/:id` - Delete video (Teacher only)
- `GET /api/videos/teacher/my-videos` - Get teacher's videos
- `GET /api/videos/stats` - Get video statistics

### AI
- `POST /api/ai/ask` - Chat with AI assistant (Student only)
- `POST /api/ai/generate-task` - Generate task via AI (Teacher only)
- `GET /api/ai/stats` - Get AI usage statistics

### Health Check
- `GET /api/health` - Server health status

## 🏗️ Project Structure

```
├── config/
│   ├── database.js          # Database connection with pooling
│   ├── appwrite.js          # Appwrite storage configuration
│   ├── cors.js              # CORS configuration
│   ├── logger.js            # Winston logging setup
│   └── validateEnv.js       # Environment validation
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── taskController.js    # Task management
│   ├── submissionController.js # Submission handling
│   ├── videoController.js   # Video management
│   └── aiController.js      # AI integration
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   ├── upload.js            # File upload handling
│   ├── validation.js        # Input validation
│   ├── security.js          # Security middleware
│   └── logging.js           # Request/response logging
├── models/
│   ├── User.js              # User model
│   ├── Task.js              # Task model
│   ├── Submission.js        # Submission model
│   └── Video.js             # Video model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── tasks.js             # Task routes
│   ├── submissions.js       # Submission routes
│   ├── videos.js            # Video routes
│   └── ai.js                # AI routes
├── logs/                    # Application logs
├── server.js                # Main server file
├── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Role-based Access Control** (Student/Teacher)
- **Password Hashing** with bcrypt
- **Rate Limiting** for API protection
- **Security Headers** with Helmet.js
- **CORS Protection** with configurable origins
- **Input Validation** and sanitization
- **File Upload Security** with type and size validation

## 📊 Logging

- **Request/Response Logging** for all API calls
- **Error Logging** with stack traces
- **Performance Monitoring** for slow requests
- **User Activity Tracking** for security
- **File-based Logging** with rotation
- **Development Console Logging** with colors

## 🚦 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **AI Endpoints**: 10 requests per minute
- **Configurable** via environment variables

## 📁 File Upload

### Supported Formats
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Images (.jpg, .jpeg, .png)

### Limits
- Maximum file size: 10MB
- Stored in Appwrite Storage
- Secure access control

## 🌍 Environment Variables

See `env.example` for all required environment variables.

## 📝 API Documentation

Comprehensive API documentation is available in `API_DOCUMENTATION.md`.

## 🧪 Testing

Testing framework setup is planned for future versions.

## 📈 Performance

- Database connection pooling
- Automatic retry logic
- Response compression
- Efficient indexing
- Graceful shutdown handling

## 🔄 Development

The server automatically restarts on file changes when using `npm run dev`.

## 📄 License

ISC
