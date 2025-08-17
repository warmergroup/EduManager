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
  <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
    <!-- Generate Task Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🚀 Vazifa Yaratish</h2>
      <p class="text-gray-600 mb-6">Sun'iy intellekt yordamida yaratuvchan vazifalar yarating</p>

      <form @submit.prevent="handleGenerateTask" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">📚 Mavzu yoki fan</label>
          <input v-model="form.topic" type="text" placeholder="Masalan: Matematika, Fizika, Tarix..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">📊 Qiyinlik darajasi</label>
          <select v-model="form.difficulty"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required>
            <option value="">Qiyinlik darajasini tanlang</option>
            <option value="beginner">🟢 Boshlang'ich</option>
            <option value="intermediate">🟡 O'rta</option>
            <option value="advanced">🔴 Yuqori</option>
          </select>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          {{ loading ? '⏳ Vazifa yaratilmoqda...' : '🤖 AI yordamida vazifa yaratish' }}
        </button>
      </form>
    </div>

    <!-- Generated Task Section -->
    <div v-if="generatedTask" class="mb-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">✨ Yaratilgan Vazifa</h3>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <p class="text-gray-800 whitespace-pre-wrap">{{ generatedTask }}</p>
      </div>

      <div class="flex gap-3">
        <button @click="copyToClipboard" :class="[
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        ]">
          {{ copied ? '✅ Nusxalandi!' : '📋 Nusxalash' }}
        </button>

        <button @click="createTaskFromGenerated"
          class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          💾 Vazifa sifatida saqlash
        </button>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">💾 Vazifani Saqlash</h3>

        <form @submit.prevent="handleCreateTask" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">📝 Vazifa nomi</label>
            <input v-model="createForm.title" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">📅 Muddat</label>
            <input v-model="createForm.dueDate" type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required />
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showCreateModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Bekor qilish
            </button>

            <button type="submit" :disabled="createLoading"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200">
              {{ createLoading ? '⏳ Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="taskCreated" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Muvaffaqiyatli!</h3>
        <p class="text-gray-600 mb-4">Vazifa muvaffaqiyatli yaratildi va saqlandi</p>
        <button @click="taskCreated = false"
          class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200">
          Tushunarli
        </button>
      </div>
    </div>

    <!-- Error Display -->
    <Alert v-if="error" :show="!!error" type="error" title="Xatolik" :message="error" class="mb-4" />
  </div>
</template>
