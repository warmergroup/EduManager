# Complete Setup Guide

## Prerequisites

Before starting, make sure you have:
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Appwrite account and project
- OpenAI API account

## Step 1: Clone and Install

\`\`\`bash
# Clone the repository (if from GitHub)
git clone <repository-url>
cd student-assignment-backend

# Install dependencies
npm install
\`\`\`

## Step 2: Environment Configuration

1. Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Update the `.env` file with your credentials:

### MongoDB Setup
- **Local MongoDB:** `mongodb://localhost:27017/student-assignment-db`
- **MongoDB Atlas:** Get connection string from your Atlas dashboard

### JWT Secret
Generate a secure random string:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

### Appwrite Configuration
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project
3. Go to Settings → View API Keys → Create API Key
4. Create a storage bucket in Storage section
5. Update these values in `.env`:
   - `APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1`
   - `APPWRITE_PROJECT_ID=your-project-id`
   - `APPWRITE_API_KEY=your-api-key`
   - `APPWRITE_BUCKET_ID=your-bucket-id`

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add to `.env`: `OPENAI_API_KEY=your-openai-api-key`

## Step 3: Database Setup

The application will automatically connect to MongoDB when started. No manual database setup is required as Mongoose will create collections automatically.

## Step 4: Start the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

### Production Mode
\`\`\`bash
npm start
\`\`\`

The server will start on `http://localhost:5000`

## Step 5: Test the API

### Health Check
\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

### Register a Test User
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Teacher",
    "email": "teacher@test.com",
    "password": "password123",
    "role": "teacher"
  }'
\`\`\`

## Step 6: Frontend Integration

### CORS Configuration
The API is configured to accept requests from any origin. For production, update the CORS configuration in `server.js`:

\`\`\`javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}))
\`\`\`

### Vue 3 Frontend Setup
Create an API service in your Vue 3 app:

\`\`\`javascript
// api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
\`\`\`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access for MongoDB Atlas

2. **Appwrite File Upload Issues**
   - Verify API key permissions
   - Check bucket ID and project ID
   - Ensure bucket has proper permissions

3. **OpenAI API Errors**
   - Check API key validity
   - Verify account has sufficient credits
   - Monitor rate limits

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration (30 days default)
   - Verify Authorization header format

### Logs and Debugging

The application logs important information to the console. Check logs for:
- Database connection status
- File upload progress
- API errors and stack traces

### Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Enable HTTPS
5. Configure proper CORS origins
6. Set up monitoring and logging
7. Use environment-specific database

\`\`\`bash
# PM2 deployment example
npm install -g pm2
pm2 start server.js --name "student-api"
pm2 startup
pm2 save
\`\`\`

## API Testing

Use the provided Postman collection or test with curl commands from the API documentation.

## Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Verify environment configuration
4. Test individual endpoints
