import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { SubmissionData } from '@/types'
import { useAuthStore } from './auth'

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
      
      const authStore = useAuthStore()
      const userRole = authStore.user?.role
      
      let endpoint: string
      let responseData: any
      
      if (userRole === 'teacher') {
        // Teachers fetch all submissions
        endpoint = '/api/submissions'
        const response = await api.get(endpoint)
        
        if (response.data.success && response.data.data.submissions) {
          responseData = response.data.data.submissions
        } else if (response.data.success && response.data.data.docs) {
          // Handle paginated response
          responseData = response.data.data.docs
        } else {
          responseData = []
        }
      } else {
        // Students fetch their own progress
        endpoint = '/api/submissions/progress'
        const response = await api.get(endpoint)
        
        if (response.data.success && response.data.data.progress) {
          // For progress endpoint, we get progress object, not submissions array
          // So we'll use mock data for now or handle differently
          responseData = []
        } else {
          responseData = []
        }
      }
      
      if (responseData && responseData.length > 0) {
        // Transform backend data to frontend format
        submissions.value = responseData.map((submission: any) => ({
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
      } else {
        // Use mock data based on role
        if (userRole === 'teacher') {
          submissions.value = getMockTeacherSubmissions()
        } else {
          submissions.value = getMockSubmissions()
        }
      }
    } catch (err: any) {
      console.error('Submissions fetch error:', err)
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.error('Authentication/Authorization error - using mock data')
        // Don't set error, just use mock data
        const authStore = useAuthStore()
        const userRole = authStore.user?.role
        
        if (userRole === 'teacher') {
          submissions.value = getMockTeacherSubmissions()
        } else {
          submissions.value = getMockSubmissions()
        }
      } else {
        error.value = err.response?.data?.message || 'Topshiriqlarni yuklashda xatolik yuz berdi'
        // Use mock data as fallback
        const authStore = useAuthStore()
        const userRole = authStore.user?.role
        
        if (userRole === 'teacher') {
          submissions.value = getMockTeacherSubmissions()
        } else {
          submissions.value = getMockSubmissions()
        }
      }
    } finally {
      loading.value = false
    }
  }

  // Fetch student progress (for students)
  const fetchStudentProgress = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Fetch student's own submissions
      const response = await api.get('/api/submissions/student/my-submissions')
      
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
          originalName: submission.originalName,
          fileId: submission.fileId,
          fileSize: submission.fileSize,
          mimeType: submission.mimeType,
          score: submission.score,
          feedback: submission.feedback,
          submittedAt: submission.submittedAt,
          gradedAt: submission.gradedAt,
          isGraded: submission.isGraded
        }))
      } else {
        submissions.value = []
      }
    } catch (err: any) {
      console.error('Student submissions fetch error:', err)
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.error('Authentication/Authorization error')
        error.value = 'Authentication required'
        submissions.value = []
      } else {
        error.value = err.response?.data?.message || 'Submissions ma\'lumotlarini yuklashda xatolik yuz berdi'
        submissions.value = []
      }
    } finally {
      loading.value = false
    }
  }

  // Fetch submissions for a specific task (for teachers)
  const fetchSubmissionsForTask = async (taskId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/api/submissions/${taskId}`)
      
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
      
      const response = await api.put(`/api/submissions/${submissionId}/grade`, gradeData)
      
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

  const createSubmission = async (taskId: string, file: File, textResponse?: string) => {
    try {
      loading.value = true
      error.value = null
      
      const formData = new FormData()
      formData.append('file', file)
      
      if (textResponse) {
        formData.append('textResponse', textResponse)
      }
      
      const response = await api.post(`/api/submissions/${taskId}`, formData, {
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
    fetchStudentProgress,
    fetchRecentSubmissions,
    createSubmission,
    gradeSubmission,
    resetSubmissions
  }
})
