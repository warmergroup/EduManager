<script setup lang="ts">
import { ref } from 'vue'
import type { Task, SubmissionData } from '@/types'
import FileUpload from '@/components/FileUpload.vue'

const props = defineProps<{
  task: Task
  submission?: SubmissionData
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', taskId: string, file: File, textResponse?: string): void
}>()

const selectedFile = ref<File | null>(null)
const textResponse = ref('')
const submitting = ref(false)

const handleFileSelected = (file: File) => {
  selectedFile.value = file
}

const handleFileRemoved = () => {
  selectedFile.value = null
}

const submit = async () => {
  if (!selectedFile.value) return

  submitting.value = true

  try {
    emit('submit', props.task._id, selectedFile.value, textResponse.value)
  } finally {
    submitting.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ task.title }}</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Task Details -->
      <div class="p-6">
        <!-- Task Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">📋 Vazifa tavsifi</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-700 leading-relaxed">{{ task.description }}</p>
          </div>
        </div>

        <!-- Task File (if exists) -->
        <div v-if="task.file" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">📎 Vazifa fayli</h3>
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 18h12V6l-4-4H4v16zm2-14h5v4h4v8H6V4z" />
              </svg>
              <div class="flex-1">
                <p class="font-medium text-blue-900">{{ task.file.fileName }}</p>
                <p class="text-sm text-blue-700">{{ formatFileSize(task.file.fileSize) }}</p>
              </div>
              <a :href="task.file.fileUrl" target="_blank" rel="noopener noreferrer"
                class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                Ko'rish
              </a>
            </div>
          </div>
        </div>

        <!-- Submission Form -->
        <div v-if="!submission" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">📤 Vazifani topshirish</h3>

          <!-- Text Response -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Javobingiz (ixtiyoriy)
            </label>
            <textarea v-model="textResponse" rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vazifa haqida qisqacha izoh yoki javob yozing..."></textarea>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fayl biriktirish *
            </label>
            <FileUpload @file-selected="handleFileSelected" @file-removed="handleFileRemoved"
              accept="image/*,.pdf,.doc,.docx" :max-size="10 * 1024 * 1024" />
            <p class="mt-2 text-sm text-gray-500">
              Rasm, PDF yoki Word hujjat yuklashingiz mumkin. Maksimal hajm: 10MB
            </p>
          </div>
        </div>

        <!-- Existing Submission -->
        <div v-else class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">✅ Topshirilgan vazifa</h3>
          <div class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-green-900">
                  Topshirilgan: {{ new Date(submission.submittedAt).toLocaleString('uz-UZ') }}
                </p>
                <p v-if="submission.feedback" class="text-sm text-green-700 mt-1">
                  Izoh: {{ submission.feedback }}
                </p>
              </div>
              <div v-if="submission.score !== null" class="text-right">
                <span class="text-sm text-green-600">Baho:</span>
                <span
                  class="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ submission.score }}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div class="flex justify-end space-x-3">
          <button @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Yopish
          </button>

          <button v-if="!submission && selectedFile" @click="submit" :disabled="submitting"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="submitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Topshirilmoqda...
            </span>
            <span v-else>Topshirish</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
