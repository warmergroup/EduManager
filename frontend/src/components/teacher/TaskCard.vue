<template>
    <div class="bg-white rounded-lg shadow p-3 md:p-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4 gap-2 md:gap-0">
            <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg font-semibold mb-1 md:mb-2 truncate">{{ task.title }}</h3>
                <p class="text-xs md:text-sm text-gray-500 truncate">Due: {{ formatDate(task.deadline) }}</p>
            </div>

            <div class="flex items-center space-x-1 md:space-x-2 flex-shrink-0" v-if="showActions">
                <button @click="$emit('edit', task)"
                    class="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    Edit
                </button>
                <button @click="$emit('delete', task._id)"
                    class="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    Delete
                </button>
            </div>
        </div>

        <p class="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">{{ task.description }}</p>

        <!-- File Preview -->
        <div v-if="task.file" class="file-preview mb-3 md:mb-4">
            <div class="p-2 md:p-3 bg-gray-50 rounded-lg border overflow-hidden">
                <!-- Mobile Layout: Icon + File Info in one row, buttons below -->
                <div class="md:hidden">
                    <div class="flex items-center mb-2">
                        <div class="flex-shrink-0 mr-2">
                            <FileIcon :file="task.file" />
                        </div>
                        <div class="flex-1 min-w-0 overflow-hidden">
                            <p class="text-xs font-medium text-gray-900 truncate">
                                {{ task.file.fileName }}
                            </p>
                            <p class="text-xs text-gray-500 truncate">
                                {{ formatFileSize(task.file.fileSize) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <!-- Preview Button -->
                        <button @click="previewFile"
                            class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors whitespace-nowrap">
                            Preview
                        </button>
                        <!-- Download Button -->
                        <button @click="downloadFile"
                            class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors whitespace-nowrap">
                            Download
                        </button>
                    </div>
                </div>

                <!-- Desktop Layout: All in one row -->
                <div class="hidden md:flex items-center">
                    <div class="flex-shrink-0 mr-3">
                        <FileIcon :file="task.file" />
                    </div>
                    <div class="flex-1 min-w-0 overflow-hidden">
                        <p class="text-sm font-medium text-gray-900 truncate">
                            {{ task.file.fileName }}
                        </p>
                        <p class="text-sm text-gray-500 truncate">
                            {{ formatFileSize(task.file.fileSize) }}
                        </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <!-- Preview Button -->
                        <button @click="previewFile"
                            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors whitespace-nowrap">
                            Preview
                        </button>
                        <!-- Download Button -->
                        <button @click="downloadFile"
                            class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors whitespace-nowrap">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 overflow-hidden">
            <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 min-w-0 flex-1">
                <span class="text-xs md:text-sm text-gray-500 truncate">Created {{ formatDate(task.createdAt) }}</span>
                <span class="text-xs md:text-sm text-gray-500 flex-shrink-0">Submissions: {{ submissionCount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { formatDate } from '@/utils/date'
import FileIcon from '../FileIcon.vue'

const props = defineProps<{
    task: Task
    showActions?: boolean
    submissionCount?: number
}>()

defineEmits<{
    (e: 'edit', task: Task): void
    (e: 'delete', id: string): void
}>()

const submissionCount = computed(() => props.submissionCount || 0)

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
