<script setup lang="ts">
import { reactive, ref } from 'vue'
import { gradeSubmission } from '../../services/submissions'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import type { Submission, User } from '../../types'

interface Props {
  submission: Submission | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const form = reactive({
  score: props.submission?.score || 0,
  feedback: props.submission?.feedback || ''
})

const handleSubmit = async () => {
  if (!props.submission) return

  loading.value = true
  error.value = null

  try {
    await gradeSubmission(props.submission._id, form.score, form.feedback)
    success.value = true
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 1500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to submit grade'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Grade Submission: {{ (submission?.studentId as User)?.fullName }}
      </h3>

      <div class="mb-4">
        <p class="text-sm text-gray-600">
          <strong>File:</strong>
          <a :href="submission?.fileUrl" target="_blank" rel="noopener noreferrer"
            class="text-primary-600 hover:text-primary-900 underline ml-1">
            {{ submission?.fileName }}
          </a>
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Score (0-100)
            </label>
            <input v-model.number="form.score" type="number" min="0" max="100" required class="input-field"
              placeholder="Enter score" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea v-model="form.feedback" rows="4" class="input-field"
              placeholder="Provide feedback to the student..."></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-3 mt-6">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            <span v-if="!loading">Submit Grade</span>
            <Loading v-else text="Submitting..." />
          </button>
        </div>
      </form>

      <Alert :show="!!error" type="error" title="Error" :message="error || 'An error occurred'" @close="error = null" />

      <Alert :show="success" type="success" title="Success!" message="Grade submitted successfully"
        @close="success = false" />
    </div>
  </div>
</template>
