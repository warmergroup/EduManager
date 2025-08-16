<script setup lang="ts">
import { formatDate } from '../../utils/date'
import type { Task, Submission } from '../../types'
import TaskStatus from './TaskStatus.vue'

defineProps<{
    task: Task
    submission?: Submission
}>()

defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>

    <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="$emit('click')">
        <!-- Task header -->
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ task.title }}</h3>
            <TaskStatus :deadline="task.deadline" :isSubmitted="!!submission" :isGraded="submission?.isGraded" />
        </div>

        <!-- Task description -->
        <p class="text-gray-600 mb-4 line-clamp-2">{{ task.description }}</p>

        <!-- Task metadata -->
        <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Due: {{ formatDate(task.deadline) }}</span>
            <span v-if="submission?.score">
                Score: {{ submission.score }}/100
            </span>
        </div>
    </div>
</template>
