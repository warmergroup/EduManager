export interface User {
  _id: string
  fullName: string
  email: string
  role: 'student' | 'teacher'
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  role: 'student' | 'teacher'
}

export interface Task {
  _id: string
  title: string
  description: string
  deadline: string
  createdBy: string | User
  isCompleted?: boolean
  file?: {
    fileId: string
    fileName: string
    fileSize: number
    mimeType: string
    fileUrl: string
  }
  createdAt: string
  updatedAt: string
}

export interface TaskCreate {
  title: string
  description: string
  deadline: string
  file?: File
}

export interface Video {
  _id: string
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: number
  createdBy: string | User
  createdAt: string
  updatedAt: string
}

export interface VideoCreate {
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: number
}

// Backend API response structure
export interface Submission {
  _id: string
  taskId: string | Task
  studentId: string | User
  fileUrl: string
  fileName: string
  fileSize: number
  score: number | null
  feedback: string
  isGraded: boolean
  createdAt: string
  updatedAt: string
}

// Frontend store data structure (transformed from API)
export interface SubmissionData {
  id: string
  taskId: string
  taskTitle: string
  studentId: string
  studentName: string
  fileUrl: string
  fileName: string
  submittedAt: string
  isGraded: boolean
  score?: number
  feedback?: string
  gradedAt?: string
}

export interface AIRequest {
  question?: string
  subject?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  taskType?: 'assignment' | 'project' | 'quiz' | 'essay' | 'presentation' | 'research' | 'practical'
  additionalRequirements?: string
}

export interface AIResponse {
  success: boolean
  data: {
    question?: string
    answer?: string
    generatedTask?: string
    timestamp: string
  }
}

export interface Progress {
  totalTasks: number
  submittedTasks: number
  gradedTasks: number
  pendingGrades: number
  completionPercentage: number
  averageScore: number
}

// Backend API response wrapper
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

// Pagination interface
export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}