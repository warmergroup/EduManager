<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { getSubmissions } from '../../services/submissions'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import type { Task, Submission, User } from '../../types'

interface Props {
  task: Task | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
  grade: [submission: Submission]
}>()

const submissions = ref<Submission[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-100 text-green-800'
  if (grade >= 80) return 'bg-blue-100 text-blue-800'
  if (grade >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const fetchSubmissions = async () => {
  if (!props.task) return

  loading.value = true
  error.value = null

  try {
    const { submissions: submissionList } = await getSubmissions(props.task._id)
    submissions.value = submissionList
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load submissions'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.task) {
    fetchSubmissions()
  }
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    fetchSubmissions()
  }
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">
        Submissions for: {{ task?.title }}
      </h3>
      <button @click="$emit('close')" class="btn-secondary">
        Close
      </button>
    </div>

    <Loading v-if="loading" text="Loading submissions..." />

    <div v-else-if="submissions.length === 0" class="text-center py-8">
      <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
      <p class="mt-1 text-sm text-gray-500">No student submissions yet.</p>
    </div>

    <div v-else class="overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grade
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="submission in submissions" :key="submission._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ (submission.studentId as User)?.fullName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a :href="submission.fileUrl" target="_blank" rel="noopener noreferrer"
                class="text-primary-600 hover:text-primary-900 underline">
                {{ submission.fileName }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(submission.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span v-if="submission.isGraded"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getGradeColor(submission.score || 0)">
                {{ submission.score }}/100
              </span>
              <span v-else class="text-gray-400">Not graded</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="$emit('grade', submission)" class="text-primary-600 hover:text-primary-900">
                {{ submission.isGraded ? 'Edit Grade' : 'Grade' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error || ''" @close="error = null" />
  </div>
</template>
