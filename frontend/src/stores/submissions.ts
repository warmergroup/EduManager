import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { SubmissionData } from '@/types'

export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref<SubmissionData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const totalSubmissions = computed(() => submissions.value.length)
  const gradedSubmissions = computed(() => submissions.value.filter(s => s.isGraded))
  const pendingSubmissions = computed(() => submissions.value.filter(s => !s.isGraded))

  const fetchSubmissions = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Backend API endpoint: /api/submissions/progress for student's own submissions
      const response = await api.get('/submissions/progress')
      
      // Transform backend data to frontend format
      if (response.data.success && response.data.data.progress) {
        // For now, use mock data since backend doesn't return individual submissions
        // TODO: Create proper endpoint for fetching student submissions
        submissions.value = getMockSubmissions()
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Topshiriqlarni yuklashda xatolik yuz berdi'
      console.error('Submissions fetch error:', err)
      
      // Mock data for development
      submissions.value = getMockSubmissions()
    } finally {
      loading.value = false
    }
  }

  // Fetch submissions for a specific task (for teachers)
  const fetchSubmissionsForTask = async (taskId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/submissions/${taskId}`)
      
      if (response.data.success && response.data.data.submissions) {
        // Transform backend data to frontend format
        submissions.value = response.data.data.submissions.map((submission: any) => ({
          id: submission._id,
          taskId: submission.taskId._id || submission.taskId,
          taskTitle: submission.taskId.title || 'Unknown Task',
          studentId: submission.studentId._id || submission.studentId,
          studentName: submission.studentId.fullName || 'Unknown Student',
          fileUrl: submission.fileUrl,
          fileName: submission.fileName,
          submittedAt: submission.createdAt,
          isGraded: submission.isGraded,
          score: submission.score,
          feedback: submission.feedback,
          gradedAt: submission.gradedAt
        }))
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Topshiriqlarni yuklashda xatolik yuz berdi'
      console.error('Fetch submissions for task error:', err)
      submissions.value = []
    } finally {
      loading.value = false
    }
  }

  // Fetch all submissions for teacher
  const fetchMySubmissions = async () => {
    try {
      loading.value = true
      error.value = null
      
      // For now, use mock data since we don't have a specific endpoint
      // TODO: Create proper endpoint for fetching all submissions for teacher
      submissions.value = getMockTeacherSubmissions()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Topshiriqlarni yuklashda xatolik yuz berdi'
      console.error('Fetch my submissions error:', err)
      submissions.value = []
    } finally {
      loading.value = false
    }
  }

  // Grade a submission (for teachers)
  const gradeSubmission = async (submissionId: string, gradeData: { score: number; feedback: string }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/submissions/${submissionId}/grade`, gradeData)
      
      if (response.data.success) {
        // Update the submission in the store
        const index = submissions.value.findIndex(s => s.id === submissionId)
        if (index !== -1) {
          submissions.value[index] = {
            ...submissions.value[index],
            score: gradeData.score,
            feedback: gradeData.feedback,
            isGraded: true,
            gradedAt: new Date().toISOString()
          }
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Topshiriqni baholashda xatolik yuz berdi'
      console.error('Grade submission error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMockSubmissions = (): SubmissionData[] => {
    return [
      {
        id: '1',
        taskId: 'task1',
        taskTitle: 'Matematika vazifasi',
        studentId: 'student1',
        studentName: 'Aziz Azizov',
        fileUrl: '/files/submission1.pdf',
        fileName: 'matematika_vazifasi.pdf',
        submittedAt: '2024-01-15T10:30:00Z',
        isGraded: true,
        score: 85,
        feedback: 'Yaxshi ishlangan, lekin ba\'zi xatolar bor',
        gradedAt: '2024-01-16T14:20:00Z'
      },
      {
        id: '2',
        taskId: 'task2',
        taskTitle: 'Fizika loyihasi',
        studentId: 'student1',
        studentName: 'Aziz Azizov',
        fileUrl: '/files/submission2.pdf',
        fileName: 'fizika_loyihasi.pdf',
        submittedAt: '2024-01-18T15:45:00Z',
        isGraded: false
      }
    ]
  }

  const getMockTeacherSubmissions = (): SubmissionData[] => {
    return [
      {
        id: '1',
        taskId: 'task1',
        taskTitle: 'Matematika vazifasi',
        studentId: 'student1',
        studentName: 'Aziz Azizov',
        fileUrl: '/files/submission1.pdf',
        fileName: 'matematika_vazifasi.pdf',
        submittedAt: '2024-01-15T10:30:00Z',
        isGraded: true,
        score: 85,
        feedback: 'Yaxshi ishlangan, lekin ba\'zi xatolar bor',
        gradedAt: '2024-01-16T14:20:00Z'
      },
      {
        id: '2',
        taskId: 'task2',
        taskTitle: 'Fizika loyihasi',
        studentId: 'student2',
        studentName: 'Malika Malikova',
        fileUrl: '/files/submission2.pdf',
        fileName: 'fizika_loyihasi.pdf',
        submittedAt: '2024-01-18T15:45:00Z',
        isGraded: false
      }
    ]
  }

  const fetchRecentSubmissions = async (limit: number = 5) => {
    try {
      loading.value = true
      error.value = null
      
      // TODO: Implement when backend endpoint is available
      // const response = await api.get(`/submissions/recent?limit=${limit}`)
      // submissions.value = response.data
      
      // For now, return recent from current data
      submissions.value = getMockSubmissions().slice(0, limit)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'So\'nggi topshiriqlarni yuklashda xatolik yuz berdi'
      console.error('Recent submissions fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const createSubmission = async (taskId: string, file: File) => {
    try {
      loading.value = true
      error.value = null
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post(`/submissions/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        // Transform backend response to frontend format
        const newSubmission: SubmissionData = {
          id: response.data.data.submission._id,
          taskId: response.data.data.submission.taskId,
          taskTitle: 'New Task', // TODO: Get from task
          studentId: response.data.data.submission.studentId,
          studentName: 'Current User', // TODO: Get from auth store
          fileUrl: response.data.data.submission.fileUrl,
          fileName: response.data.data.submission.fileName,
          submittedAt: response.data.data.submission.createdAt,
          isGraded: false
        }
        
        submissions.value.unshift(newSubmission)
        return newSubmission
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Topshiriqni yuklashda xatolik yuz berdi'
      console.error('Create submission error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetSubmissions = () => {
    submissions.value = []
    error.value = null
  }

  return {
    submissions,
    loading,
    error,
    isLoading,
    hasError,
    totalSubmissions,
    gradedSubmissions,
    pendingSubmissions,
    fetchSubmissions,
    fetchSubmissionsForTask,
    fetchMySubmissions,
    fetchRecentSubmissions,
    createSubmission,
    gradeSubmission,
    resetSubmissions
  }
})
