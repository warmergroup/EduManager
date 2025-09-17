<script setup lang="ts">
import { formatDate } from '@/utils/date'
import FileIcon from '../FileIcon.vue'

interface SubmissionData {
    id: string
    taskId: string
    taskTitle: string
    studentId: string
    studentName: string
    fileUrl: string
    fileName: string
    fileSize?: number
    mimeType?: string
    submittedAt: string
    isGraded: boolean
    score?: number
    feedback?: string
    gradedAt?: string
}

defineProps<{
    submission: SubmissionData
    showGradeButton?: boolean
}>()

defineEmits<{
    (e: 'grade', submission: SubmissionData): void
}>()

// File size formatting
const formatFileSize = (bytes: number | undefined | null): string => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
    <div
        class="bg-white rounded-lg shadow p-3 md:p-6 overflow-hidden hover:shadow-xl transition-shadow duration-300 min-w-0 max-w-full">
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
        <div class="flex items-center mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg overflow-hidden min-w-0">
            <div class="flex-shrink-0 mr-2 md:mr-3">
                <FileIcon :file="{
                    fileName: submission.fileName,
                    mimeType: submission.mimeType || 'application/octet-stream',
                    fileSize: submission.fileSize || 0,
                    fileUrl: submission.fileUrl,
                    fileId: submission.id
                }" variant="student" />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
                <p class="text-sm md:text-base font-medium truncate">{{ submission.fileName }}</p>
                <p class="text-xs md:text-sm text-gray-500 truncate">
                    {{ $t('tasks.fileUploaded') }} • {{ formatFileSize(submission.fileSize) }}
                </p>
            </div>
            <a :href="submission.fileUrl" target="_blank"
                class="ml-2 md:ml-auto text-blue-500 hover:text-blue-600 flex-shrink-0 text-xs md:text-sm whitespace-nowrap">
                {{ $t('tasks.download') }}
            </a>
        </div>

        <!-- Grade Info -->
        <div v-if="submission.isGraded" class="border-t border-b pt-3 md:pt-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm md:text-base text-gray-600">{{ $t('tasks.score') }}:</span>
                <span class="text-sm md:text-base font-semibold text-green-600">{{ submission.score }}/100</span>
            </div>
            <p v-if="submission.feedback" class="text-gray-600 text-xs md:text-sm mb-3">
                {{ submission.feedback }}
            </p>
        </div>

        <!-- Grade Button -->
        <div v-if="showGradeButton" class="w-40 mx-auto md:mx-0 pt-3 md:pt-4">
            <button @click="$emit('grade', submission)"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
                {{ submission.isGraded ? '✏️ ' + $t('tasks.editGrade') : '📝 ' + $t('tasks.gradeSubmission') }}
            </button>
        </div>
    </div>
</template>