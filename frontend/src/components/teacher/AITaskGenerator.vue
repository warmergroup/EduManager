<script setup lang="ts">
import { ref, reactive } from 'vue'
import { generateTask as generateAITask } from '../../services/ai'
// import type { AIRequest, AIResponse } from '@/types'
import { useTasksStore } from '../../stores/tasks'
import type { TaskCreate } from '@/types'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'

const tasksStore = useTasksStore()

const loading = ref(false)
const createLoading = ref(false)
const error = ref<string | undefined>(undefined)
const copied = ref(false)
const taskCreated = ref(false)
const generatedTask = ref('')
const showCreateModal = ref(false)

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface GenerateForm {
  topic: string
  difficulty: Difficulty | ''
}

interface CreateForm {
  title: string
  description: string
  dueDate: string
}

const form = reactive<GenerateForm>({
  topic: '',
  difficulty: ''
})

const createForm = reactive<CreateForm>({
  title: '',
  description: '',
  dueDate: ''
})

const handleGenerateTask = async () => {
  loading.value = true
  error.value = undefined

  try {
    if (!form.difficulty) {
      throw new Error('Please select difficulty level')
    }

    const response = await generateAITask({
      subject: form.topic,
      difficulty: form.difficulty as Difficulty
    })
    if (response && response.generatedTask) {
      generatedTask.value = response.generatedTask
    } else {
      throw new Error('Invalid response from AI service')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to generate task'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedTask.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Failed to copy to clipboard'
  }
}

const createTaskFromGenerated = () => {
  createForm.title = form.topic
  createForm.description = generatedTask.value
  createForm.dueDate = new Date().toISOString().slice(0, 16)
  showCreateModal.value = true
}

const handleCreateTask = async () => {
  createLoading.value = true

  try {
    const taskData: TaskCreate = {
      title: createForm.title,
      description: createForm.description,
      deadline: new Date(createForm.dueDate).toISOString()
    }

    await tasksStore.createTask(taskData)
    taskCreated.value = true
    showCreateModal.value = false

    // Reset forms
    form.topic = ''
    form.difficulty = ''
    generatedTask.value = ''

    setTimeout(() => {
      taskCreated.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Failed to create task'
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">AI Task Generator</h3>

    <form @submit.prevent="handleGenerateTask" class="space-y-4 mb-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Topic</label>
        <input v-model="form.topic" type="text" required class="input-field"
          placeholder="e.g., JavaScript Functions, Linear Algebra, Essay Writing" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
        <select v-model="form.difficulty" required class="input-field">
          <option value="">Select difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" :disabled="loading" class="btn-primary w-full">
        <span v-if="!loading">Generate Task</span>
        <Loading v-else text="Generating..." />
      </button>
    </form>

    <div v-if="generatedTask" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 class="font-medium text-gray-900 mb-2">Generated Task:</h4>
      <div class="prose prose-sm max-w-none">
        <p class="whitespace-pre-wrap">{{ generatedTask }}</p>
      </div>

      <div class="flex items-center justify-end space-x-3 mt-4">
        <button @click="copyToClipboard" class="btn-secondary text-sm">
          Copy Text
        </button>
        <button @click="createTaskFromGenerated" class="btn-primary text-sm">
          Create Task
        </button>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error" @close="error = undefined" />

    <Alert :show="copied" type="success" title="Copied!" message="Task text copied to clipboard"
      @close="copied = false" />

    <Alert :show="taskCreated" type="success" title="Success!" message="Task created successfully"
      @close="taskCreated = false" />

    <!-- Create Task Modal -->
    <div v-if="showCreateModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create Task from AI Generation</h3>

        <form @submit.prevent="handleCreateTask">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="createForm.title" type="text" required class="input-field" placeholder="Task title" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="createForm.description" required rows="6" class="input-field"
                placeholder="Task description"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="createForm.dueDate" type="datetime-local" required class="input-field" />
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 mt-6">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="createLoading" class="btn-primary">
              <span v-if="!createLoading">Create Task</span>
              <Loading v-else text="Creating..." />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
