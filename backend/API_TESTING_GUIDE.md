# API Testing Guide

## Postman Collection Import

1. **Import Collection**:
   - Postman ochib, "Import" tugmasini bosing
   - `postman_collection.json` faylini tanlang
   - Collection import bo'ladi

2. **Environment Variables**:
   - Collection variables:
     - `base_url`: `http://localhost:5000/api`
     - `jwt_token`: (avtomatik to'ldiriladi login qilganda)

## Testing Workflow

### 1. Authentication Test
\`\`\`
1. Register Teacher → POST /api/auth/register
2. Register Student → POST /api/auth/register  
3. Login (Teacher) → POST /api/auth/login (JWT token avtomatik saqlanadi)
4. Get Profile → GET /api/auth/profile
\`\`\`

### 2. Task Management Test (Teacher sifatida)
\`\`\`
1. Create Task → POST /api/tasks
2. Get All Tasks → GET /api/tasks
3. Get Task by ID → GET /api/tasks/:id
4. Update Task → PUT /api/tasks/:id
5. Get Task Stats → GET /api/tasks/:id/stats
\`\`\`

### 3. Student Workflow Test
\`\`\`
1. Login as Student → POST /api/auth/login
2. View Tasks → GET /api/tasks
3. Submit Task → POST /api/submissions (file upload)
4. View My Submissions → GET /api/submissions/my
\`\`\`

### 4. File Upload Test
- **Endpoint**: `POST /api/submissions`
- **Body Type**: `form-data`
- **Fields**:
  - `taskId`: Task ID (text)
  - `file`: File to upload (file)
- **Supported formats**: PDF, DOCX, JPG, PNG

### 5. AI Features Test
\`\`\`
1. Student AI Chat → POST /api/ai/ask
2. Teacher Task Generation → POST /api/ai/generate-task
\`\`\`

## Common Test Scenarios

### Error Testing
- **401 Unauthorized**: Token yo'q yoki noto'g'ri
- **403 Forbidden**: Role permission yo'q
- **404 Not Found**: Resource topilmadi
- **400 Bad Request**: Validation xatolari

### File Upload Testing
- Valid files: PDF, DOCX, images
- Invalid files: TXT, EXE (400 error)
- Large files: >10MB (400 error)

### Role-based Access Testing
- Student endpoints: tasks (read), submissions, AI chat
- Teacher endpoints: tasks (CRUD), grading, AI generation
- Cross-role access: 403 Forbidden

## Response Examples

### Successful Login
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher"
  }
}
\`\`\`

### Task Creation
\`\`\`json
{
  "success": true,
  "task": {
    "id": "task_id",
    "title": "JavaScript Fundamentals",
    "description": "Complete exercises",
    "deadline": "2024-12-31T23:59:59.000Z",
    "maxScore": 100,
    "createdBy": "teacher_id"
  }
}
\`\`\`

### File Submission
\`\`\`json
{
  "success": true,
  "submission": {
    "id": "submission_id",
    "taskId": "task_id",
    "studentId": "student_id",
    "fileUrl": "https://appwrite-url/file-id",
    "fileName": "assignment.pdf",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "status": "submitted"
  }
}
\`\`\`

## Tips

1. **JWT Token**: Login qilganda token avtomatik saqlanadi
2. **File Upload**: Postman da "form-data" ishlatish kerak
3. **Role Testing**: Teacher va Student accountlar alohida yarating
4. **Error Handling**: Har bir endpoint uchun error casesni test qiling
5. **Pagination**: Tasks va submissions uchun page/limit parametrlarini sinab ko'ring
