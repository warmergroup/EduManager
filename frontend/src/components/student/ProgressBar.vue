<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { getProgress } from '../../services/progress'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import type { Progress } from '../../types'

const progress = ref<Progress | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchProgress = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getProgress()
    progress.value = response
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load progress'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProgress()
})
</script>
<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 {{ $t('dashboard.student.progressIndicator') }}</h3>

    <Loading v-if="loading" text="Loading progress..." />

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">{{ $t('dashboard.student.submittedTasks') }}</span>
        <span class="font-medium">{{ progress?.submittedTasks || 0 }} / {{ progress?.totalTasks || 0 }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">{{ $t('dashboard.student.gradedTasks') }}</span>
        <span class="font-medium">{{ progress?.gradedTasks || 0 }} / {{ progress?.submittedTasks || 0 }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">{{ $t('dashboard.student.averageScore') }}</span>
        <span class="font-medium">{{ progress?.averageScore || 0 }}%</span>
      </div>

      <div class="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div class="bg-primary-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${progress?.completionPercentage || 0}%` }"></div>
      </div>

      <div class="text-center mt-2">
        <span class="text-2xl font-bold text-primary-600">{{ progress?.completionPercentage || 0 }}%</span>
        <p class="text-sm text-gray-600">{{ $t('dashboard.student.completion') }}</p>
      </div>

      <div v-if="progress?.completionPercentage === 100" class="text-center mt-4">
        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircleIcon class="w-4 h-4 mr-1" />
          {{ $t('dashboard.student.allTasksCompleted') }}
        </div>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error || ''" @close="error = null" />
  </div>
</template>
