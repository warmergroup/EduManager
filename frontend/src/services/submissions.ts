import api from './api'
import type { Submission } from '@/types'

interface SubmissionResponse {
  success: boolean
  message: string
  data: {
    submission: Submission
  }
}

interface SubmissionsResponse {
  success: boolean
  message: string
  data: {
    submissions: Submission[]
    total: number
    page: number
    limit: number
  }
}

export const submitAssignment = async (taskId: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post<SubmissionResponse>(`/api/submissions/${taskId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data.data.submission
}

export const gradeSubmission = async (submissionId: string, score: number, feedback: string) => {
  const response = await api.put<SubmissionResponse>(`/api/submissions/${submissionId}/grade`, {
    score,
    feedback
  })
  return response.data.data.submission
}

export const getSubmissions = async (taskId: string, page = 1, limit = 10) => {
  const response = await api.get<SubmissionsResponse>(`/api/submissions/${taskId}`, {
    params: { page, limit }
  })
  return response.data.data
}

export const getSingleSubmission = async (submissionId: string) => {
  const response = await api.get<SubmissionResponse>(`/api/submissions/single/${submissionId}`)
  return response.data.data.submission
}