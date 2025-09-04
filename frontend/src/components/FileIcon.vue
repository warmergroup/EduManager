<template>
    <!-- Image Icon -->
    <svg v-if="fileType.startsWith('image/')" class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd" />
    </svg>

    <!-- PDF Icon -->
    <svg v-else-if="fileType.includes('pdf')" :class="[
        'w-8 h-8',
        props.variant === 'student' ? 'text-blue-500' : 'text-red-500'
    ]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 18h12V6l-4-4H4v16zm2-14h5v4h4v8H6V4z" />
    </svg>

    <!-- Word Icon -->
    <svg v-else-if="fileType.includes('word') || fileType.includes('docx')" :class="[
        'w-8 h-8',
        props.variant === 'student' ? 'text-blue-500' : 'text-blue-500'
    ]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 18h12V6l-4-4H4v16zm2-14h5v4h4v8H6V4z" />
    </svg>

    <!-- Default Icon -->
    <svg v-else class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FilePreview {
    name: string
    size: number
    type: string
    file: File
}

interface TaskFile {
    fileId: string
    fileName: string
    fileSize: number
    mimeType: string
    fileUrl: string
}

const props = defineProps<{
    file: FilePreview | TaskFile
    variant?: 'teacher' | 'student' // teacher = red icons, student = blue icons
}>()

// Get file type from either interface
const fileType = computed(() => {
    if ('type' in props.file) {
        return props.file.type // FilePreview
    } else {
        return props.file.mimeType // TaskFile
    }
})
</script>
