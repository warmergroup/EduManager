<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useSubmissionsStore } from '@/stores/submissions'
import type { Task, Submission } from '@/types'
import TaskCard from '@/components/student/TaskCard.vue'
import TaskDetailModal from '@/components/student/TaskDetailModal.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Stores
const taskStore = useTasksStore()
const submissionStore = useSubmissionsStore()
const { tasks, loading, error } = storeToRefs(taskStore)
const { submissions } = storeToRefs(submissionStore)

// State
const selectedTask = ref<Task | null>(null)
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

// Methods
const getSubmission = (taskId: string): Submission | undefined => {
    return submissions.value.find((s: Submission) => s.taskId === taskId)
}

const openTask = (task: Task) => {
    selectedTask.value = task
}

const handleSubmit = async (taskId: string, file: File) => {
    try {
        await submissionStore.submitTask(taskId, file)
        selectedTask.value = null
    } catch (err) {
        console.error('Failed to submit task:', err)
    }
}

// Lifecycle
onMounted(async () => {
    await taskStore.fetchTasks()
    await submissionStore.fetchMySubmissions()
})
</script>
<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">My Tasks</h1>
            <div class="flex gap-4">
                <select v-model="filter" class="px-4 py-2 border rounded-lg">
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                </select>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Error state -->
        <Alert v-if="error" show type="error" title="Error" :message="error" class="mb-4" />

        <!-- Tasks list -->
        <div v-if="!loading && tasks.length > 0" class="grid gap-4">
            <TaskCard v-for="task in filteredTasks" :key="task._id" :task="task" :submission="getSubmission(task._id)"
                @click="openTask(task)" />
        </div>

        <!-- Empty state -->
        <div v-if="!loading && tasks.length === 0" class="text-center py-8 text-gray-500">
            No tasks available
        </div>

        <!-- Task detail modal -->
        <TaskDetailModal v-if="selectedTask" :task="selectedTask" :submission="getSubmission(selectedTask._id)"
            @close="selectedTask = null" @submit="handleSubmit" />
    </div>
</template>
