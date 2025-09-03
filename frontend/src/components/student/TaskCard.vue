<script setup lang="ts">

import type { Task } from '@/types'
import { formatDate } from '@/utils/date'
import FileIcon from '../FileIcon.vue'

const props = defineProps<{
    task: Task
    submissionStatus?: 'submitted' | 'graded'
}>()

defineEmits<{
    (e: 'submit', task: Task): void
}>()

// File size formatting
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// File preview
const previewFile = () => {
    if (props.task.file?.fileUrl) {
        // PDF va rasm fayllarini browser'da ochish
        if (props.task.file.mimeType?.includes('pdf') || props.task.file.mimeType?.startsWith('image/')) {
            window.open(props.task.file.fileUrl, '_blank')
        } else {
            // Boshqa fayl turlarini yuklab olish
            downloadFile()
        }
    }
}

// File download
const downloadFile = () => {
    if (props.task.file?.fileUrl) {
        const link = document.createElement('a')
        link.href = props.task.file.fileUrl
        link.download = props.task.file.fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
</script>

<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                <p class="text-sm text-gray-500">{{ $t('tasks.due') }}: {{ formatDate(task.deadline) }}</p>
            </div>

            <div class="flex items-center space-x-2">
                <button @click="$emit('submit', task)"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    {{ $t('tasks.submitTask') }}
                </button>
            </div>
        </div>

        <p class="text-gray-600 mb-4">{{ task.description }}</p>

        <!-- File Preview -->
        <div v-if="task.file" class="file-preview mb-4">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg border">
                <div class="flex-shrink-0 mr-3">
                    <FileIcon :file="task.file" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                        {{ task.file.fileName }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ formatFileSize(task.file.fileSize) }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <!-- Preview Button -->
                    <button @click="previewFile"
                        class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                        {{ $t('tasks.preview') }}
                    </button>
                    <!-- Download Button -->
                    <button @click="downloadFile"
                        class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                        {{ $t('tasks.download') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ $t('tasks.createdBy') }}: {{ formatDate(task.createdAt) }}</span>
            <span v-if="submissionStatus" class="px-2 py-1 rounded-full text-xs"
                :class="submissionStatus === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                {{ submissionStatus === 'submitted' ? $t('tasks.submitted') : $t('tasks.graded') }}
            </span>
        </div>
    </div>
</template>
