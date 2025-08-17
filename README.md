# 🎓 EduManager - Student Assignment Management Platform

A comprehensive web application for managing student assignments, video lessons, and AI-powered task generation. Built with modern technologies for both teachers and students.

## ✨ Features

### 👨‍🏫 **Teacher Features**
- Create, edit, and delete assignments
- Upload and manage video lessons
- Grade student submissions with feedback
- AI-powered task generation
- Student progress monitoring
- Dashboard with analytics

### 👨‍🎓 **Student Features**
- View and submit assignments
- Watch video lessons
- Chat with AI assistant
- Track progress and grades
- Upload assignment files

## 🛠️ Tech Stack

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Appwrite SDK (File Storage)
- OpenAI API Integration

### **Frontend**
- Vue 3 + Composition API
- TypeScript
- Pinia (State Management)
- Tailwind CSS
- Vite (Build Tool)

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+
- MongoDB
- Appwrite Account
- OpenAI API Key

### **Installation**

1. **Clone Repository**
```bash
git clone https://github.com/warmergroup/EduManager.git
cd EduManager
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **Environment Variables**

Create `.env` file in backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/student-assignment-db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=30d

# Appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_BUCKET_ID=your-bucket-id

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📱 Screenshots

### Teacher Dashboard
![Teacher Dashboard](screenshots/teacher-dashboard.png)

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Video Lessons
![Video Lessons](screenshots/video-lessons.png)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Submissions
- `POST /api/submissions/:taskId` - Submit assignment
- `GET /api/submissions/:taskId` - Get submissions for task
- `PUT /api/submissions/:id/grade` - Grade submission

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add new video

### AI
- `POST /api/ai/ask` - Ask AI question
- `POST /api/ai/generate-task` - Generate task with AI

## 🌐 Deployment

### **Backend Deployment**
```bash
# Production build
npm run build
npm start
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy dist folder to your hosting
```

### **Domain Configuration**
1. Point your domain to your hosting provider
2. Configure SSL certificate
3. Update CORS_ORIGIN in backend .env
4. Update frontend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- OpenAI for AI capabilities
- Appwrite for file storage solution

## 📞 Support

If you have any questions or need help, please open an issue on [GitHub](https://github.com/warmergroup/EduManager).

---

**Made with ❤️ for better education**

---

## 🔗 Links

- **Repository**: [https://github.com/warmergroup/EduManager](https://github.com/warmergroup/EduManager)
- **Issues**: [https://github.com/warmergroup/EduManager/issues](https://github.com/warmergroup/EduManager/issues)
- **Discussions**: [https://github.com/warmergroup/EduManager/discussions](https://github.com/warmergroup/EduManager/discussions)
