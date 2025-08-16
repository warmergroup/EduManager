<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { useTasksStore } from '@/stores/tasks'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'
import type { Task } from '@/types'

const emit = defineEmits<{
  viewSubmissions: [task: Task]
}>()

const tasksStore = useTasksStore()
const showTaskModal = ref(false)
const isEditing = ref(false)
const editingTask = ref<Task | null>(null)
const taskLoading = ref(false)
const success = ref(false)
const successMessage = ref('')
const localError = ref<string | null>(null)

const taskForm = reactive({
  title: '',
  description: '',
  deadline: ''
})

const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error || localError.value)

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
}

const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  showTaskModal.value = true
}

const editTask = (task: Task) => {
  editingTask.value = task
  taskForm.title = task.title
  taskForm.description = task.description
  taskForm.deadline = new Date(task.deadline).toISOString().slice(0, 16)
  isEditing.value = true
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  resetForm()
}

const resetForm = () => {
  taskForm.title = ''
  taskForm.description = ''
  taskForm.deadline = ''
  editingTask.value = null
}

const handleTaskSubmit = async () => {
  taskLoading.value = true
  localError.value = null

  try {
    // Convert deadline to ISO string if it's not already
    const taskData = {
      ...taskForm,
      deadline: new Date(taskForm.deadline).toISOString()
    }

    if (isEditing.value && editingTask.value) {
      await tasksStore.updateTask(editingTask.value._id, taskData)
      successMessage.value = 'Task updated successfully'
    } else {
      await tasksStore.createTask(taskData)
      successMessage.value = 'Task created successfully'
    }

    await tasksStore.fetchTasks()
    success.value = true
    closeTaskModal()
  } catch (err: any) {
    localError.value = err.response?.data?.message || err.message || 'Failed to save task'
    console.error('Task submission error:', err)
  } finally {
    taskLoading.value = false
  }
}

const deleteTaskConfirm = async (task: Task) => {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    try {
      await tasksStore.deleteTask(task._id)
      await tasksStore.fetchTasks()
      successMessage.value = 'Task deleted successfully'
      success.value = true
    } catch (err: any) {
      localError.value = err.message || 'Failed to delete task'
    }
  }
}

const viewSubmissions = (task: Task) => {
  emit('viewSubmissions', task)
}

const fetchData = async () => {
  try {
    await tasksStore.fetchTasks()
  } catch (err: any) {
    localError.value = err.message || 'Failed to load tasks'
  }
}

onMounted(() => {
  fetchData()
})
</script>


<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Task Management</h3>
      <button @click="openCreateModal" class="btn-primary">
        Create New Task
      </button>
    </div>

    <Loading v-if="loading" text="Loading tasks..." />

    <div v-else-if="!tasks?.length" class="text-center py-8">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
      <p class="mt-1 text-sm text-gray-500">Create your first task to get started.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="task in tasks" :key="task._id"
        class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
            <p class="text-xs text-gray-500 mt-2">
              Due: {{ formatDate(task.deadline) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="editTask(task)" class="btn-secondary text-sm">
              Edit
            </button>
            <button @click="viewSubmissions(task)" class="btn-primary text-sm">
              View Submissions
            </button>
            <button @click="deleteTaskConfirm(task)" class="text-red-600 hover:text-red-800 text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEditing ? 'Edit Task' : 'Create New Task' }}
        </h3>

        <form @submit.prevent="handleTaskSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="taskForm.title" type="text" required class="input-field" placeholder="Task title" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="taskForm.description" required rows="3" class="input-field"
                placeholder="Task description"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="taskForm.deadline" type="datetime-local" required class="input-field" />
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 mt-6">
            <button type="button" @click="closeTaskModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="taskLoading" class="btn-primary">
              <span v-if="!taskLoading">{{ isEditing ? 'Update' : 'Create' }}</span>
              <Loading v-else :text="isEditing ? 'Updating...' : 'Creating...'" />
            </button>
          </div>
        </form>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error || ''" @close="error = null" />

    <Alert :show="success" type="success" title="Success" :message="successMessage" @close="success = false" />
  </div>
</template>