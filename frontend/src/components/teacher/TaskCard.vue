<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-lg font-semibold">{{ task.title }}</h3>
                <p class="text-sm text-gray-500">Due: {{ formatDate(task.deadline) }}</p>
            </div>

            <div class="flex items-center space-x-2" v-if="showActions">
                <button @click="$emit('edit', task)" class="p-2 text-blue-500 hover:text-blue-600">
                    Edit
                </button>
                <button @click="$emit('delete', task._id)" class="p-2 text-red-500 hover:text-red-600">
                    Delete
                </button>
            </div>
        </div>

        <p class="text-gray-600 mb-4">{{ task.description }}</p>

        <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Created {{ formatDate(task.createdAt) }}</span>
            <span>Submissions: {{ submissionCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { formatDate } from '@/utils/date'

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
</script>
