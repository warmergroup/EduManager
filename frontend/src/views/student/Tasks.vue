<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// Lifecycle
onMounted(async () => {
    await taskStore.fetchTasks()
    await submissionStore.fetchStudentProgress()
})
</script>

<template>
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">📚 Vazifalar va Topshiriqlar</h1>
            <p class="mt-2 text-gray-600">Barcha vazifalar va ularning holatini ko'rish</p>
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
                        📝 Vazifalar
                    </button>
                    <button @click="activeTab = 'submissions'" :class="[
                        'py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'submissions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        📤 Topshirilgan Vazifalar
                    </button>
                </nav>
            </div>
        </div>

        <!-- Filter -->
        <div v-if="activeTab === 'submissions'" class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <select v-model="filter"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <option value="all">🔍 Hammasi</option>
                    <option value="graded">✅ Baholangan</option>
                    <option value="pending">⏳ Kutilmoqda</option>
                </select>
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
                    :submission="getSubmission(task._id)" @click="openTask(task)" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                Vazifalar mavjud emas
            </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions' && !loading">
            <div v-if="filteredSubmissions.length > 0" class="grid gap-4">
                <SubmissionCard v-for="submission in filteredSubmissions" :key="submission.id"
                    :submission="submission" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                Topshirilgan vazifalar mavjud emas
            </div>
        </div>

        <!-- Task detail modal -->
        <TaskDetailModal v-if="selectedTask" :task="selectedTask" :submission="getSubmission(selectedTask._id)"
            @close="selectedTask = null" @submit="handleSubmit" />
    </div>
</template>
