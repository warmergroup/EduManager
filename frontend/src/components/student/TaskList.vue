<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">My Tasks</h3>
      <button @click="fetchTasks" :disabled="loading" class="btn-secondary text-sm">
        Refresh
      </button>
    </div>

    <Loading v-if="loading" text="Loading tasks..." />

    <div v-else-if="tasks.length === 0" class="text-center py-8">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
      <p class="mt-1 text-sm text-gray-500">You don't have any tasks yet.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="task in tasks" :key="task._id"
        class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900" :class="{ 'line-through': task.isCompleted }">
              {{ task.title }}
            </h4>
            <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
            <p class="text-xs text-gray-500 mt-2">
              Due: {{ formatDate(task.deadline) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="task.isCompleted"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckIcon class="w-3 h-3 mr-1" />
              Completed
            </span>
            <button v-else @click="$emit('uploadFile', task)" class="btn-primary text-sm">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error || ''" @close="error = null" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { DocumentTextIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { useTasksStore } from '../../stores/tasks'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import type { Task } from '../../types'

defineEmits<{
  uploadFile: [task: Task]
}>()

const tasksStore = useTasksStore()
const { tasks, loading, error } = tasksStore

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy')
}

const fetchTasks = async () => {
  await tasksStore.fetchTasks()
}

onMounted(() => {
  fetchTasks()
})
</script>