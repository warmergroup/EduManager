<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { Task, TaskCreate, SubmissionData } from '@/types'
import TaskCard from '@/components/teacher/TaskCard.vue'
import TaskFormModal from '@/components/teacher/TaskFormModal.vue'
import SubmissionCard from '@/components/student/SubmissionCard.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks, loading, error } = storeToRefs(taskStore)
const { submissions } = storeToRefs(submissionStore)

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedTask = ref<Task | undefined>(undefined)
const taskToDelete = ref<string | null>(null)
const activeTab = ref('tasks') // 'tasks' or 'submissions'
const filter = ref('all')

// Computed
const filteredSubmissions = computed(() => {
    if (filter.value === 'all') return submissions.value
    return submissions.value.filter((s: SubmissionData) =>
        filter.value === 'graded' ? s.isGraded : !s.isGraded
    )
})

// Methods
const openCreateModal = () => {
    selectedTask.value = undefined
    showModal.value = true
}

const editTask = (task: Task) => {
    selectedTask.value = task
    showModal.value = true
}

const closeModal = () => {
    selectedTask.value = undefined
    showModal.value = false
}

const handleTabChange = (tab: string) => {
    activeTab.value = tab
    // Reset filter when switching tabs
    filter.value = 'all'
}

const handleSubmit = async (taskData: TaskCreate) => {
    try {
        if (selectedTask.value) {
            await taskStore.updateTask(selectedTask.value._id, taskData)
        } else {
            await taskStore.createTask(taskData)
        }
        closeModal()
    } catch (err: any) {
        console.error('Failed to save task:', err)
        error.value = err.message || 'Failed to save task'
    }
}

const confirmDelete = (taskId: string) => {
    taskToDelete.value = taskId
    showDeleteModal.value = true
}

const deleteTask = async () => {
    if (!taskToDelete.value) return

    try {
        await taskStore.deleteTask(taskToDelete.value)
        showDeleteModal.value = false
        taskToDelete.value = null
    } catch (err) {
        console.error('Failed to delete task:', err)
    }
}

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([
            taskStore.fetchTasks(),
            submissionStore.fetchMySubmissions()
        ])
    } catch (err) {
        console.error('Failed to load data:', err)
        // Don't redirect on error, just show error state
    }
})
</script>

<template>

    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Vazifalar va Topshiriqlar</h1>
            <p class="mt-2 text-gray-600">Vazifalarni yaratish, tahrirlash va student topshirishlarini ko'rish</p>
        </div>

        <!-- Error Display -->
        <Alert v-if="error" :show="!!error" type="error" title="Xatolik" :message="error" class="mb-6" />

        <!-- Tabs -->
        <div class="mb-6">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button @click="handleTabChange('tasks')" :class="[
                        'py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === 'tasks'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        📝 Vazifalar
                    </button>
                    <button @click="handleTabChange('submissions')" :class="[
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

        <!-- Filter and Actions -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <select v-model="filter" class="px-4 py-2 border rounded-lg">
                    <option value="all">Hammasi</option>
                    <option v-if="activeTab === 'submissions'" value="graded">✅ Baholangan</option>
                    <option v-if="activeTab === 'submissions'" value="pending">⏳ Kutilmoqda</option>
                </select>
            </div>
            <button v-if="activeTab === 'tasks'" @click="openCreateModal"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2">
                + Yangi Vazifa
            </button>
            <router-link v-if="activeTab === 'tasks'" to="/teacher/create-task"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                📝 Vazifa Yaratish
            </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks' && !loading">
            <div v-if="tasks.length > 0" class="grid gap-4">
            <TaskCard v-for="task in tasks" :key="task._id" :task="task" :showActions="true" @edit="editTask"
                @delete="confirmDelete" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                <p class="text-lg font-medium mb-2">Hali vazifalar mavjud emas</p>
                <p class="text-sm">Birinchi vazifani yaratish uchun yuqoridagi "Yangi Vazifa" tugmasini bosing</p>
            </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions' && !loading">
            <div v-if="filteredSubmissions.length > 0" class="grid gap-4">
                <SubmissionCard v-for="submission in filteredSubmissions" :key="submission.id"
                    :submission="submission" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                <p class="text-lg font-medium mb-2">Hali topshirishlar mavjud emas</p>
                <p class="text-sm">Student'lar vazifalarni topshirgandan so'ng bu yerda ko'rinadi</p>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <TaskFormModal v-if="showModal" :task="selectedTask" @close="closeModal" @submit="handleSubmit" />

        <!-- Delete Confirmation Modal -->
        <ConfirmModal v-if="showDeleteModal" title="Vazifani o'chirish"
            message="Bu vazifani o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi." @confirm="deleteTask"
            @cancel="showDeleteModal = false" />
    </div>
</template>