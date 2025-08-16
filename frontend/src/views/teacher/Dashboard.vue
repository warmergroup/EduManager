<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 gap-8">
        <TaskManager @viewSubmissions="viewSubmissions" />

        <SubmissionList v-if="selectedTask" :task="selectedTask" @grade="openGradeModal" @close="selectedTask = null" />

        <GradeForm v-if="showGradeModal && selectedSubmission" :submission="selectedSubmission" @close="closeGradeModal"
          @success="handleGradeSuccess" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskManager from '../../components/teacher/TaskManager.vue'
import SubmissionList from '../../components/teacher/SubmissionList.vue'
import GradeForm from '../../components/teacher/GradeForm.vue'
import type { Task, Submission } from '../../types'

const selectedTask = ref<Task | null>(null)
const selectedSubmission = ref<Submission | null>(null)
const showGradeModal = ref(false)

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