<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskManager from '../../components/teacher/TaskManager.vue'
import SubmissionList from '../../components/teacher/SubmissionList.vue'
import GradeForm from '../../components/teacher/GradeForm.vue'
import { useTeacherStore } from '@/stores/teacher'
import type { Task, Submission } from '../../types'
import { AcademicCapIcon } from '@heroicons/vue/24/outline'

const teacherStore = useTeacherStore()
const { stats: analytics } = storeToRefs(teacherStore)

const selectedTask = ref<Task | null>(null)
const selectedSubmission = ref<Submission | null>(null)
const showGradeModal = ref(false)

// Mock data for charts (TODO: Replace with real data from backend)
const recentTasks = ref([
  { id: 1, title: 'Matematika vazifasi', submissionCount: 15, completionRate: 80 },
  { id: 2, title: 'Fizika loyihasi', submissionCount: 12, completionRate: 65 },
  { id: 3, title: 'Ingliz tili', submissionCount: 18, completionRate: 90 }
])

const monthlyActivity = ref([
  { month: 'Yanvar', activity: 85 },
  { month: 'Fevral', activity: 92 },
  { month: 'Mart', activity: 78 },
  { month: 'Aprel', activity: 88 }
])

onMounted(async () => {
  await teacherStore.fetchTeacherStats()
})

const viewSubmissions = (task: Task) => {
  selectedTask.value = task
}

const openGradeModal = (submission: Submission) => {
  selectedSubmission.value = submission
  showGradeModal.value = true
}

const closeGradeModal = () => {
  showGradeModal.value = false
  selectedSubmission.value = null
}

const handleGradeSuccess = () => {
  closeGradeModal()
  // Refresh submissions if needed
}



</script>
<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">O'qituvchilik faoliyatidagi statistikalar va vazifalar</p>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Jami Vazifalar</p>
            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalTasks || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Video Darslar</p>
            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalVideos || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <AcademicCapIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Talabalar</p>
            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalStudents || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">O'rtacha Ball</p>
            <p class="text-2xl font-semibold text-gray-900">{{ analytics.averageScore || 0 }}/100</p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    <!-- Task Completion Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Vazifalar Bajarilishi</h3>
      <div class="space-y-4">
        <div v-for="task in recentTasks" :key="task.id" class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
            <p class="text-xs text-gray-500">{{ task.submissionCount }} ta topshiriq</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div :style="{ width: `${task.completionRate}%` }"
                class="bg-blue-600 h-2 rounded-full transition-all duration-500"></div>
            </div>
            <span class="text-xs text-gray-600 w-12">{{ task.completionRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Activity Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Oylik Faollik</h3>
      <div class="space-y-4">
        <div v-for="month in monthlyActivity" :key="month.month" class="flex items-center justify-between">
          <span class="text-sm text-gray-600">{{ month.month }}</span>
          <div class="flex items-center space-x-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div :style="{ width: `${month.activity}%` }"
                class="bg-green-600 h-2 rounded-full transition-all duration-500"></div>
            </div>
            <span class="text-xs text-gray-600 w-12">{{ month.activity }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 gap-8">
    <TaskManager @viewSubmissions="viewSubmissions" />

    <SubmissionList v-if="selectedTask" :task="selectedTask" @grade="openGradeModal" @close="selectedTask = null" />

    <GradeForm v-if="showGradeModal && selectedSubmission" :submission="selectedSubmission" @close="closeGradeModal"
      @success="handleGradeSuccess" />
  </div>
</template>
