<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Tasks</h1>
            <button @click="openCreateModal" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Create Task
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Error state -->
        <!-- <Alert v-if="error" type="error" :message="error" class="mb-4" /> -->
        <Alert v-if="error" show type="error" title="Error" :message="error" class="mb-4" />
        <!-- Tasks list -->
        <div v-if="!loading && tasks.length > 0" class="grid gap-4">
            <TaskCard v-for="task in tasks" :key="task._id" :task="task" :showActions="true" @edit="editTask"
                @delete="confirmDelete" />
        </div>

        <!-- Empty state -->
        <div v-if="!loading && tasks.length === 0" class="text-center py-8 text-gray-500">
            No tasks created yet
        </div>

        <!-- Create/Edit Modal -->
        <TaskFormModal v-if="showModal" :task="selectedTask" @close="closeModal" @submit="handleSubmit" />

        <!-- Delete Confirmation Modal -->
        <ConfirmModal v-if="showDeleteModal" title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone." @confirm="deleteTask"
            @cancel="showDeleteModal = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import type { Task, TaskCreate } from '@/types'
import TaskCard from '@/components/teacher/TaskCard.vue'
import TaskFormModal from '@/components/teacher/TaskFormModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

// Store
const taskStore = useTasksStore()
const { tasks, loading, error } = storeToRefs(taskStore)

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedTask = ref<Task | undefined>(undefined)
const taskToDelete = ref<string | null>(null)

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

const handleSubmit = async (taskData: Partial<Task> & TaskCreate) => {
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
    await taskStore.fetchTasks()
})
</script>
