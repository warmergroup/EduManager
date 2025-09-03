# Student Assignment Backend

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# Appwrite Configuration (for file uploads)
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_BUCKET_ID=your_appwrite_bucket_id

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://edumanager.sultonovdev.uz
```

## Appwrite Setup

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Create a storage bucket with the following permissions:
   - Create files: `true`
   - Read files: `true`
   - Update files: `true`
   - Delete files: `true`
4. Generate an API key with admin permissions
5. Copy the project ID, API key, and bucket ID to your `.env` file

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```
