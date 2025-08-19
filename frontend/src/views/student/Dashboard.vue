<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskList from '../../components/student/TaskList.vue'
import ProgressBar from '../../components/student/ProgressBar.vue'
import TaskUpload from '../../components/student/TaskUpload.vue'
import { useProgressStore } from '@/stores/progress'
import type { Task } from '../../types'

const progressStore = useProgressStore()
const { progress } = storeToRefs(progressStore)
const showUploadModal = ref(false)
const selectedTask = ref<Task | null>(null)

onMounted(async () => {
  await progressStore.fetchProgress()
})

const openUploadModal = (task: Task) => {
  selectedTask.value = task
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedTask.value = null
}

const handleUploadSuccess = () => {
  // Refresh tasks and progress here if needed
  closeUploadModal()
  progressStore.fetchProgress()
}
</script>

<template>

  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">O'qish jarayonidagi natijalaringiz va vazifalar</p>
    </div>

    <!-- Progress Overview Cards -->
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
            <p class="text-2xl font-semibold text-gray-900">{{ progress.totalTasks || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Topshirilgan</p>
            <p class="text-2xl font-semibold text-gray-900">{{ progress.submittedTasks || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Kutilmoqda</p>
            <p class="text-2xl font-semibold text-gray-900">{{ progress.pendingGrades || 0 }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ progress.averageScore || 0 }}/100</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Progress Chart -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="font-medium text-gray-900 mb-4">Umumiy Progress</h3>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Tamamlanish
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-blue-600">
              {{ progress.completionPercentage || 0 }}%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div :style="{ width: `${progress.completionPercentage || 0}%` }"
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500">
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            📚 Mening Vazifalarim
          </h3>
          <TaskList @uploadFile="openUploadModal" />
        </div>
      </div>
      <div>
        <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            📊 Progress Ko'rsatkichi
          </h3>
          <ProgressBar />
        </div>
      </div>
    </div>
    <TaskUpload v-if="showUploadModal" :task="selectedTask" @close="closeUploadModal" @success="handleUploadSuccess" />
  </div>
</template>