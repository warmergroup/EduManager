<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { Task, SubmissionData } from '@/types'
import TaskCard from '@/components/student/TaskCard.vue'
import TaskDetailModal from '@/components/student/TaskDetailModal.vue'
import SubmissionCard from '@/components/student/SubmissionCard.vue'
import TaskPageLayout from '@/components/common/TaskPageLayout.vue'

// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks, loading, error } = storeToRefs(taskStore)
const { submissions } = storeToRefs(submissionStore)

// State
const selectedTask = ref<Task | null>(null)
const activeTab = ref('tasks') // 'tasks' or 'submissions'
const filter = ref('all')

// Filter options for submissions tab
const submissionFilterOptions = [
    { value: 'all', label: 'All', icon: '🔍', translationKey: 'tasks.all' },
    { value: 'graded', label: 'Graded', icon: '✅', translationKey: 'tasks.graded' },
    { value: 'pending', label: 'Pending', icon: '⏳', translationKey: 'tasks.pending' }
]

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

// Tab change handler
const handleTabChange = (tab: string) => {
    activeTab.value = tab
    // Reset filter when switching tabs
    filter.value = 'all'
}

// Lifecycle
onMounted(async () => {
    await taskStore.fetchTasks()
    await submissionStore.fetchStudentProgress()
})
</script>

<template>
    <TaskPageLayout :activeTab="activeTab" :loading="loading" :error="error" :showSubmissionsTab="true"
        :filterOptions="activeTab === 'submissions' ? submissionFilterOptions : []" :currentFilter="filter"
        @tab-change="handleTabChange" @filter-change="(newFilter) => filter = newFilter">
        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks'">
            <div v-if="filteredTasks.length > 0" class="grid gap-4">
                <TaskCard v-for="task in filteredTasks" :key="task._id" :task="task"
                    :submission="getSubmission(task._id)" @submit="openTask" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                {{ $t('tasks.noTasks') }}
            </div>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'">
            <div v-if="filteredSubmissions.length > 0" class="grid gap-4">
                <SubmissionCard v-for="submission in filteredSubmissions" :key="submission.id"
                    :submission="submission" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                {{ $t('tasks.noSubmittedTasks') }}
            </div>
        </div>
    </TaskPageLayout>

    <!-- Task detail modal -->
    <TaskDetailModal v-if="selectedTask" :task="selectedTask" :submission="getSubmission(selectedTask._id)"
        @close="selectedTask = null" @submit="handleSubmit" />
</template>
