# Student Assignment Management API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
All protected routes require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Response Format
All API responses follow this format:
\`\`\`json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
\`\`\`

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
\`\`\`json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "teacher"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token"
  }
}
\`\`\`

### Login User
**POST** `/auth/login`

**Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Get User Profile
**GET** `/auth/profile`
- **Auth Required:** Yes

---

## Task Management Endpoints

### Get All Tasks
**GET** `/tasks`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search in title/description

### Get Single Task
**GET** `/tasks/:id`
- **Auth Required:** Yes

### Create Task
**POST** `/tasks`
- **Auth Required:** Yes (Teacher only)

**Body:**
\`\`\`json
{
  "title": "Assignment Title",
  "description": "Detailed description of the assignment",
  "deadline": "2024-12-31T23:59:59.000Z"
}
\`\`\`

### Update Task
**PUT** `/tasks/:id`
- **Auth Required:** Yes (Teacher only - own tasks)

### Delete Task
**DELETE** `/tasks/:id`
- **Auth Required:** Yes (Teacher only - own tasks)

### Get Task Statistics
**GET** `/tasks/:id/stats`
- **Auth Required:** Yes (Teacher only - own tasks)

---

## Submission Endpoints

### Submit Assignment
**POST** `/submissions/:taskId`
- **Auth Required:** Yes (Student only)
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `file` field (PDF, DOCX, DOC, JPG, PNG - max 10MB)

### Get Submissions for Task
**GET** `/submissions/:taskId`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Items per page

### Get Single Submission
**GET** `/submissions/single/:submissionId`
- **Auth Required:** Yes

### Grade Submission
**PUT** `/submissions/:submissionId/grade`
- **Auth Required:** Yes (Teacher only)

**Body:**
\`\`\`json
{
  "score": 85,
  "feedback": "Good work! Consider improving..."
}
\`\`\`

### Get Student Progress
**GET** `/submissions/progress`
- **Auth Required:** Yes (Student only)

---

## Video Lessons Endpoints

### Get All Videos
**GET** `/videos`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `search` (optional): Search in title/description

### Get Single Video
**GET** `/videos/:id`
- **Auth Required:** Yes

### Add Video Lesson
**POST** `/videos`
- **Auth Required:** Yes (Teacher only)

**Body:**
\`\`\`json
{
  "title": "Introduction to Programming",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "description": "Basic programming concepts"
}
\`\`\`

### Update Video
**PUT** `/videos/:id`
- **Auth Required:** Yes (Teacher only - own videos)

### Delete Video
**DELETE** `/videos/:id`
- **Auth Required:** Yes (Teacher only - own videos)

### Get My Videos
**GET** `/videos/teacher/my-videos`
- **Auth Required:** Yes (Teacher only)

### Get Video Statistics
**GET** `/videos/stats`
- **Auth Required:** Yes (Teacher only)

---

## AI Endpoints

### Student AI Chat
**POST** `/ai/ask`
- **Auth Required:** Yes (Student only)

**Body:**
\`\`\`json
{
  "question": "Can you explain the concept of variables in programming?"
}
\`\`\`

### Generate Task via AI
**POST** `/ai/generate-task`
- **Auth Required:** Yes (Teacher only)

**Body:**
\`\`\`json
{
  "subject": "Mathematics",
  "difficulty": "intermediate",
  "taskType": "assignment",
  "additionalRequirements": "Include real-world examples"
}
\`\`\`

**Valid Values:**
- `difficulty`: "beginner", "intermediate", "advanced"
- `taskType`: "assignment", "project", "quiz", "essay", "presentation", "research", "practical"

### Get AI Statistics
**GET** `/ai/stats`
- **Auth Required:** Yes (Teacher only)

---

## Error Codes

- **400** - Bad Request (validation errors, missing fields)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **429** - Too Many Requests (rate limiting)
- **500** - Internal Server Error
- **503** - Service Unavailable (external service issues)

---

## File Upload Specifications

### Supported File Types
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Images (.jpg, .jpeg, .png)

### File Size Limits
- Maximum file size: 10MB
- Files are stored in Appwrite Storage
- File URLs are saved in MongoDB

### File Security
- Files are accessible only to:
  - The student who uploaded them
  - Teachers who created the related task
- File permissions are managed through Appwrite

---

## Rate Limiting

- AI endpoints have built-in rate limiting
- OpenAI API limits apply to AI features
- Consider implementing application-level rate limiting for production

---

## Environment Variables Required

\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student-assignment-db
JWT_SECRET=your-super-secret-jwt-key-here
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_BUCKET_ID=your-bucket-id
OPENAI_API_KEY=your-openai-api-key
