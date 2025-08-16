<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <TaskList @uploadFile="openUploadModal" />
        </div>
        <div>
          <ProgressBar />
        </div>
      </div>
    </div>

    <TaskUpload v-if="showUploadModal" :task="selectedTask" @close="closeUploadModal" @success="handleUploadSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskList from '../../components/student/TaskList.vue'
import ProgressBar from '../../components/student/ProgressBar.vue'
import TaskUpload from '../../components/student/TaskUpload.vue'
import type { Task } from '../../types'

const showUploadModal = ref(false)
const selectedTask = ref<Task | null>(null)

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
}
</script>