<script setup lang="ts">
import { formatDate } from '@/utils/date'

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
</script>

<template>
    <div class="bg-white rounded-lg shadow p-3 md:p-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <!-- Header -->
        <div
            class="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4 gap-2 md:gap-0 overflow-hidden">
            <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg font-semibold mb-1 md:mb-2 truncate">{{ submission.taskTitle }}</h3>
                <p class="text-xs md:text-sm text-gray-500 truncate">{{ $t('tasks.submitted') }}: {{
                    formatDate(submission.submittedAt) }}
                </p>
            </div>
            <div :class="[
                'px-2 py-1 text-xs md:text-sm rounded-full self-start flex-shrink-0',
                submission.isGraded
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
            ]">
                {{ submission.isGraded ? $t('tasks.graded') : $t('tasks.pending') }}
            </div>
        </div>

        <!-- File Info -->
        <div class="flex items-center mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg overflow-hidden">
            <svg class="h-5 w-5 md:h-6 md:w-6 text-gray-400 mr-2 md:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div class="flex-1 min-w-0 overflow-hidden">
                <p class="text-sm md:text-base font-medium truncate">{{ submission.fileName }}</p>
                <p class="text-xs md:text-sm text-gray-500 truncate">{{ $t('tasks.fileUploaded') }}</p>
            </div>
            <a :href="submission.fileUrl" target="_blank"
                class="ml-2 md:ml-auto text-blue-500 hover:text-blue-600 flex-shrink-0 text-xs md:text-sm whitespace-nowrap">
                {{ $t('tasks.download') }}
            </a>
        </div>

        <!-- Grade Info -->
        <div v-if="submission.isGraded" class="border-t pt-3 md:pt-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm md:text-base text-gray-600">{{ $t('tasks.score') }}:</span>
                <span class="text-sm md:text-base font-semibold">{{ submission.score }}/100</span>
            </div>
            <p v-if="submission.feedback" class="text-gray-600 text-xs md:text-sm">
                {{ submission.feedback }}
            </p>
        </div>
    </div>
</template>