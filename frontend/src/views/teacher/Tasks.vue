<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { Task, TaskCreate, SubmissionData } from '@/types'
import TaskCard from '@/components/teacher/TaskCard.vue'
import TaskFormModal from '@/components/teacher/TaskFormModal.vue'
import SubmissionCard from '@/components/student/SubmissionCard.vue'
import GradeModal from '@/components/teacher/GradeModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import TaskPageLayout from '@/components/common/TaskPageLayout.vue'


// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks, loading, error } = storeToRefs(taskStore)
const { submissions } = storeToRefs(submissionStore)

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const showGradeModal = ref(false)
const selectedTask = ref<Task | undefined>(undefined)
const selectedSubmission = ref<SubmissionData | undefined>(undefined)
const taskToDelete = ref<string | null>(null)
const activeTab = ref('tasks') // 'tasks' or 'submissions'
const filter = ref('all')

// Filter options for submissions tab
const submissionFilterOptions = [
    { value: 'all', label: 'All', icon: '🔍', translationKey: 'tasks.all' },
    { value: 'graded', label: 'Graded', icon: '✅', translationKey: 'tasks.graded' },
    { value: 'pending', label: 'Pending', icon: '⏳', translationKey: 'tasks.pending' }
]

// Computed
const filteredSubmissions = computed(() => {
    if (filter.value === 'all') return submissions.value
    return submissions.value.filter((s: SubmissionData) =>
        filter.value === 'graded' ? s.isGraded : !s.isGraded
    )
})


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

// Grade functions
const openGradeModal = (submission: SubmissionData) => {
    selectedSubmission.value = submission
    showGradeModal.value = true
}

const closeGradeModal = () => {
    showGradeModal.value = false
    selectedSubmission.value = undefined
}

const handleGrade = async (gradeData: { score: number; feedback: string }) => {
    if (!selectedSubmission.value) return

    try {
        await submissionStore.gradeSubmission(selectedSubmission.value.id, gradeData)
        closeGradeModal()
    } catch (err) {
        console.error('Failed to grade submission:', err)
    }
}

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([
            taskStore.fetchTasks(),
            submissionStore.fetchSubmissions() // Fetch all submissions for teacher
        ])
    } catch (err) {
        console.error('Failed to load data:', err)
        // Don't redirect on error, just show error state
    }
})
</script>

<template>
    <TaskPageLayout :activeTab="activeTab" :loading="loading" :error="error" :showSubmissionsTab="true"
        :filterOptions="activeTab === 'submissions' ? submissionFilterOptions : []" :currentFilter="filter"
        :showCreateButton="true" :createButtonText="$t('tasks.createTask')" createButtonLink="/teacher/create-task"
        @tab-change="handleTabChange" @filter-change="(newFilter) => filter = newFilter">

        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks'">
            <div v-if="tasks.length > 0" class="grid gap-4">
                <TaskCard v-for="task in tasks" :key="task._id" :task="task" :showActions="true" @edit="editTask"
                    @delete="confirmDelete" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                <p class="text-lg font-medium mb-2">{{ $t('tasks.noTasks') }}</p>
                <p class="text-sm">{{ $t('tasks.noTasksDesc') }}</p>
            </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'">
            <div v-if="filteredSubmissions.length > 0" class="grid gap-4">
                <SubmissionCard v-for="submission in filteredSubmissions" :key="submission.id" :submission="submission"
                    :showGradeButton="true" @grade="openGradeModal" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                <p class="text-lg font-medium mb-2">{{ $t('tasks.noSubmittedTasks') }}</p>
            </div>
        </div>

    </TaskPageLayout>

    <!-- Create/Edit Modal -->
    <TaskFormModal v-if="showModal" :task="selectedTask" @close="closeModal" @submit="handleSubmit" />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal v-if="showDeleteModal" :title="$t('tasks.deleteTask')" :message="$t('tasks.confirmDelete')"
        @confirm="deleteTask" @cancel="showDeleteModal = false" />

    <!-- Grade Modal -->
    <GradeModal v-if="showGradeModal && selectedSubmission" :submission="selectedSubmission" @close="closeGradeModal"
        @grade="handleGrade" />
</template>