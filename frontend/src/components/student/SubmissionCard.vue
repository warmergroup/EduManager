<template>
    <div class="bg-white rounded-lg shadow p-6">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold">{{ taskTitle }}</h3>
                <p class="text-sm text-gray-500">Submitted: {{ formatDate(submission.submittedAt) }}</p>
            </div>
            <div :class="[
                'px-2 py-1 text-sm rounded-full',
                submission.isGraded
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
            ]">
                {{ submission.isGraded ? 'Graded' : 'Pending' }}
            </div>
        </div>

        <!-- File Info -->
        <div class="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <svg class="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div>
                <p class="font-medium">{{ submission.fileName }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(submission.fileSize) }}</p>
            </div>
            <a :href="submission.fileUrl" target="_blank" class="ml-auto text-blue-500 hover:text-blue-600">
                Download
            </a>
        </div>

        <!-- Grade Info -->
        <div v-if="submission.isGraded" class="border-t pt-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Score:</span>
                <span class="font-semibold">{{ submission.score }}/100</span>
            </div>
            <p v-if="submission.feedback" class="text-gray-600 text-sm">
                {{ submission.feedback }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Submission } from '@/types'
import { formatDate, formatFileSize } from '@/utils/date'

interface SubmissionData {
    id: string
    taskId: string
    taskTitle: string
    studentId: string
    studentName: string
    fileUrl: string
    fileName: string
    submittedAt: string
    isGraded: boolean
    score?: number
    feedback?: string
    gradedAt?: string
}

defineProps<{
    submission: SubmissionData
}>()

const taskTitle = computed(() => {
    return typeof props.submission.taskId === 'string'
        ? 'Task'
        : props.submission.taskId.title
})
</script>
