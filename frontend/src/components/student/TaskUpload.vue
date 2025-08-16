<script setup lang="ts">
import { ref } from 'vue'
import { submitAssignment } from '../../services/submissions'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import type { Task } from '../../types'

interface Props {
  task: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const success = ref(false)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const handleSubmit = async () => {
  if (!selectedFile.value || !props.task) return

  loading.value = true
  error.value = undefined

  try {
    await submitAssignment(props.task._id, selectedFile.value)
    success.value = true
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 1500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to submit assignment'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Submit Assignment: {{ task?.title }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select file to upload
          </label>
          <input ref="fileInput" type="file" required @change="handleFileChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
          <p v-if="selectedFile" class="text-sm text-gray-600 mt-2">
            Selected: {{ selectedFile.name }}
          </p>
        </div>

        <div class="flex items-center justify-end space-x-3">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="!selectedFile || loading" class="btn-primary">
            <span v-if="!loading">Submit</span>
            <Loading v-else text="Uploading..." />
          </button>
        </div>
      </form>

      <Alert :show="!!error" type="error" title="Upload Error" :message="error" @close="error = undefined" />

      <Alert :show="success" type="success" title="Success!" message="Assignment submitted successfully"
        @close="success = false" />
    </div>
  </div>
</template>