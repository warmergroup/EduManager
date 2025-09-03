<script setup lang="ts">

import type { Task } from '@/types'
import { formatDate } from '@/utils/date'
import FileIcon from '../FileIcon.vue'
import api from '@/services/api'

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
const previewFile = async (event: Event) => {
    event.stopPropagation() // Event bubbling ni to'xtatish
    console.log('Preview clicked:', props.task.file)

    if (props.task.file?.fileId) {
        console.log('File ID:', props.task.file.fileId)
        console.log('MIME Type:', props.task.file.mimeType)

        try {
            // Backend API dan faylni olish
            const response = await api.get(`/api/tasks/${props.task._id}/file/${props.task.file.fileId}`, {
                responseType: 'blob'
            })
            console.log('File received from Backend:', response.data)

            // PDF va rasm fayllarini browser'da ochish
            if (props.task.file.mimeType?.includes('pdf') || props.task.file.mimeType?.startsWith('image/')) {
                const blob = new Blob([response.data], { type: props.task.file.mimeType })
                const url = window.URL.createObjectURL(blob)
                window.open(url, '_blank')
                // Cleanup
                setTimeout(() => window.URL.revokeObjectURL(url), 1000)
            } else {
                // Boshqa fayl turlarini yuklab olish
                downloadFile(event)
            }
        } catch (error) {
            console.error('Error getting file URL:', error)
        }
    } else {
        console.log('No file ID found')
    }
}

// File download
const downloadFile = async (event: Event) => {
    event.stopPropagation() // Event bubbling ni to'xtatish
    console.log('Download clicked:', props.task.file)

    if (props.task.file?.fileId) {
        console.log('Downloading file with ID:', props.task.file.fileId)

        try {
            // Backend API dan faylni olish
            const response = await api.get(`/api/tasks/${props.task._id}/file/${props.task.file.fileId}`, {
                responseType: 'blob'
            })
            console.log('File received for download:', response.data)

            // Direct download using Blob
            const blob = new Blob([response.data], { type: props.task.file.mimeType })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = props.task.file?.fileName || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download error:', error)
        }
    } else {
        console.log('No file ID found for download')
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
                    <button @click.stop="previewFile"
                        class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                        {{ $t('tasks.preview') }}
                    </button>
                    <!-- Download Button -->
                    <button @click.stop="downloadFile"
                        class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                        {{ $t('tasks.download') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ $t('tasks.createdAt') }}: {{ formatDate(task.createdAt) }}</span>
            <span v-if="submissionStatus" class="px-2 py-1 rounded-full text-xs"
                :class="submissionStatus === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                {{ submissionStatus === 'submitted' ? $t('tasks.submitted') : $t('tasks.graded') }}
            </span>
        </div>
    </div>
</template>
