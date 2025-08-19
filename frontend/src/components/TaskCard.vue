<template>
    <div
        class="task-card bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <!-- Task Header -->
        <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        {{ task.title }}
                    </h3>
                    <p class="text-gray-600 text-sm leading-relaxed">
                        {{ task.description }}
                    </p>
                </div>
                <div class="ml-4 flex-shrink-0">
                    <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    ]">
                        {{ isOverdue ? 'Muddati o\'tgan' : 'Faol' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Task File Preview -->
        <div v-if="task.file" class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                <div class="flex-shrink-0 mr-3">
                    <FileIcon :file="task.file" class="w-8 h-8 text-blue-500" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                        {{ task.file.fileName }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ formatFileSize(task.file.fileSize) }}
                    </p>
                </div>
                <a :href="task.file.fileUrl" target="_blank" rel="noopener noreferrer"
                    class="ml-2 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                    title="Faylni ko'rish">
                    <EyeIcon class="w-5 h-5" />
                </a>
            </div>
        </div>

        <!-- Task Details -->
        <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">Muddati:</span>
                    <p class="font-medium text-gray-900">
                        {{ formatDate(task.deadline) }}
                    </p>
                </div>
                <div>
                    <span class="text-gray-500">Yaratuvchi:</span>
                    <p class="font-medium text-gray-900">
                        {{ task.createdBy?.fullName || 'Noma\'lum' }}
                    </p>
                </div>
            </div>

            <!-- Student Submission Status -->
            <div v-if="task.hasSubmitted !== undefined" class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <CheckCircleIcon v-if="task.hasSubmitted" class="w-5 h-5 text-green-500 mr-2" />
                        <ClockIcon v-else class="w-5 h-5 text-yellow-500 mr-2" />
                        <span class="text-sm font-medium text-gray-700">
                            {{ task.hasSubmitted ? 'Topshirilgan' : 'Topshirilmagan' }}
                        </span>
                    </div>

                    <!-- Grade Display -->
                    <div v-if="task.score !== null" class="text-right">
                        <span class="text-sm text-gray-500">Baho:</span>
                        <span :class="[
                            'ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            getGradeColor(task.score || 0)
                        ]">
                            {{ task.score }}/100
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg">
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    {{ formatDate(task.createdAt) }} da yaratilgan
                </div>

                <div class="flex space-x-2">
                    <!-- View Button -->
                    <button @click="$emit('view', task)"
                        class="px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Ko'rish
                    </button>

                    <!-- Submit Button (for students) -->
                    <button v-if="!task.hasSubmitted && userRole === 'student'" @click="$emit('submit', task)"
                        class="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Topshirish
                    </button>

                    <!-- Edit Button (for teachers) -->
                    <button v-if="userRole === 'teacher' && task.createdBy?._id === userId" @click="$emit('edit', task)"
                        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Tahrirlash
                    </button>

                    <!-- Delete Button (for teachers) -->
                    <button v-if="userRole === 'teacher' && task.createdBy?._id === userId"
                        @click="$emit('delete', task)"
                        class="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
    CheckCircleIcon,
    ClockIcon,
    EyeIcon
} from '@heroicons/vue/24/outline'

interface TaskFile {
    fileId: string
    fileName: string
    fileSize: number
    mimeType: string
    fileUrl: string
}

interface Task {
    _id: string
    title: string
    description: string
    deadline: string
    file?: TaskFile
    createdBy?: {
        _id: string
        fullName: string
        email: string
    }
    createdAt: string
    hasSubmitted?: boolean
    submissionId?: string
    isGraded?: boolean
    score?: number
    feedback?: string
}

interface Props {
    task: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'view': [task: Task]
    'submit': [task: Task]
    'edit': [task: Task]
    'delete': [task: Task]
}>()

const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role)
const userId = computed(() => authStore.user?._id)

const isOverdue = computed(() => {
    return new Date(props.task.deadline) < new Date()
})

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getGradeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    if (score >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
}
</script>

<script lang="ts">
// File Icon Component
const FileIcon = {
    props: ['file'],
    template: `
    <svg v-if="file.mimeType.startsWith('image/')" class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
    </svg>
    <svg v-else-if="file.mimeType.includes('pdf')" class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 18h12V6l-4-4H4v16zm2-14h5v4h4v8H6V4z" />
    </svg>
    <svg v-else-if="file.mimeType.includes('word') || file.mimeType.includes('docx')" class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 18h12V6l-4-4H4v16zm2-14h5v4h4v8H6V4z" />
    </svg>
    <svg v-else class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
    </svg>
  `
}
</script>

<style scoped>
/* .task-card {
    @apply transition-all duration-200;
}

.task-card:hover {
    @apply transform -translate-y-1;
} */
</style>
