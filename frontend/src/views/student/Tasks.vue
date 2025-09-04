<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { Task, SubmissionData } from '@/types'
import TaskCard from '@/components/student/TaskCard.vue'
import TaskDetailModal from '@/components/student/TaskDetailModal.vue'
import SubmissionCard from '@/components/student/SubmissionCard.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks, loading, error } = storeToRefs(taskStore)
const { submissions } = storeToRefs(submissionStore)

// State
const selectedTask = ref<Task | null>(null)
const activeTab = ref('tasks') // 'tasks' or 'submissions'
const filter = ref('all')
const isFilterDropdownOpen = ref(false)

// Computed
const filteredTasks = computed(() => {
    if (filter.value === 'all') return tasks.value

    const hasSubmission = (taskId: string) =>
        submissions.value.some((s) => s.taskId === taskId)

    return tasks.value.filter(task =>
        filter.value === 'submitted'
            ? hasSubmission(task._id)
            : !hasSubmission(task._id)
    )
})

const filteredSubmissions = computed(() => {
    if (filter.value === 'all') return submissions.value
    return submissions.value.filter((s: SubmissionData) =>
        filter.value === 'graded' ? s.isGraded : !s.isGraded
    )
})

// Methods
const getSubmission = (taskId: string): SubmissionData | undefined => {
    return submissions.value.find((s: SubmissionData) => s.taskId === taskId)
}

const openTask = (task: Task) => {
    selectedTask.value = task
}

const handleSubmit = async (taskId: string, file: File, textResponse?: string) => {
    try {
        await submissionStore.createSubmission(taskId, file, textResponse)
        selectedTask.value = null
        // Refresh submissions after submitting
        await submissionStore.fetchStudentProgress()
    } catch (err) {
        console.error('Failed to submit task:', err)
    }
}

const switchToSubmissions = async () => {
    activeTab.value = 'submissions'
    // Refresh submissions when switching to submissions tab
    await submissionStore.fetchStudentProgress()
}

// Filter dropdown functions
const toggleFilterDropdown = () => {
    isFilterDropdownOpen.value = !isFilterDropdownOpen.value
}

const setFilter = (filterValue: string) => {
    filter.value = filterValue
    isFilterDropdownOpen.value = false
}

const getFilterLabel = (filterValue: string) => {
    const labels = {
        all: '🔍',
        graded: '✅',
        pending: '⏳'
    }
    return labels[filterValue as keyof typeof labels] || labels.all
}

const getFilterText = (filterValue: string) => {
    const texts = {
        all: 'tasks.all',
        graded: 'tasks.graded',
        pending: 'tasks.pending'
    }
    return texts[filterValue as keyof typeof texts] || texts.all
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        isFilterDropdownOpen.value = false
    }
}

// Lifecycle
onMounted(async () => {
    await taskStore.fetchTasks()
    await submissionStore.fetchStudentProgress()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('tasks.title') }}</h1>
            <p class="mt-2 text-gray-600">{{ $t('tasks.description') }}</p>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button @click="activeTab = 'tasks'" :class="[
                        'py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'tasks'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        📝 {{ $t('tasks.tasks') }}
                    </button>
                    <button @click="switchToSubmissions" :class="[
                        'py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'submissions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        📤 {{ $t('tasks.submittedTasks') }}
                    </button>
                </nav>
            </div>
        </div>

        <!-- Filter -->
        <div v-if="activeTab === 'submissions'" class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <!-- Custom Dropdown Filter -->
                <div class="relative">
                    <button @click="toggleFilterDropdown"
                        class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <span class="text-sm font-medium text-gray-700">
                            {{ getFilterLabel(filter) }} {{ $t(getFilterText(filter)) }}
                        </span>
                        <svg class="w-4 h-4 text-gray-500 transition-transform duration-200"
                            :class="{ 'rotate-180': isFilterDropdownOpen }" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Dropdown menu -->
                    <div v-if="isFilterDropdownOpen"
                        class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div class="py-1">
                            <button @click="setFilter('all')"
                                class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                                :class="{ 'bg-blue-50 text-blue-600': filter === 'all' }">
                                <span class="text-sm">🔍</span>
                                <span class="text-sm font-medium">{{ $t('tasks.all') }}</span>
                            </button>
                            <button @click="setFilter('graded')"
                                class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                                :class="{ 'bg-blue-50 text-blue-600': filter === 'graded' }">
                                <span class="text-sm">✅</span>
                                <span class="text-sm font-medium">{{ $t('tasks.graded') }}</span>
                            </button>
                            <button @click="setFilter('pending')"
                                class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                                :class="{ 'bg-blue-50 text-blue-600': filter === 'pending' }">
                                <span class="text-sm">⏳</span>
                                <span class="text-sm font-medium">{{ $t('tasks.pending') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Error state -->
        <Alert v-if="error" :show="!!error" type="error" title="Xatolik" :message="error" class="mb-4" />

        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks' && !loading">
            <div v-if="filteredTasks.length > 0" class="grid gap-4">
                <TaskCard v-for="task in filteredTasks" :key="task._id" :task="task"
                    :submission="getSubmission(task._id)" @submit="openTask" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                {{ $t('tasks.noTasks') }}
            </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions' && !loading">
            <div v-if="filteredSubmissions.length > 0" class="grid gap-4">
                <SubmissionCard v-for="submission in filteredSubmissions" :key="submission.id"
                    :submission="submission" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                {{ $t('tasks.noSubmittedTasks') }}
            </div>
        </div>

        <!-- Task detail modal -->
        <TaskDetailModal v-if="selectedTask" :task="selectedTask" :submission="getSubmission(selectedTask._id)"
            @close="selectedTask = null" @submit="handleSubmit" />
    </div>
</template>
