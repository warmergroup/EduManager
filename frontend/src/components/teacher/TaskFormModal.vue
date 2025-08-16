<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg w-full max-w-lg">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-xl font-semibold">{{ task ? 'Edit Task' : 'Create Task' }}</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6">
                <!-- Title -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input v-model="form.title" type="text" required
                        class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors.title }" />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-600">
                        {{ errors.title }}
                    </p>
                </div>

                <!-- Description -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea v-model="form.description" rows="4" required
                        class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors.description }"></textarea>
                    <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                        {{ errors.description }}
                    </p>
                </div>

                <!-- Deadline -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Deadline
                    </label>
                    <input v-model="form.deadline" type="datetime-local" required
                        class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors.deadline }" :min="minDate" />
                    <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">
                        {{ errors.deadline }}
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-4">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-gray-600 hover:text-gray-700 border rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" :disabled="loading"
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                        {{ loading ? 'Saving...' : (task ? 'Update' : 'Create') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskCreate } from '@/types'

const props = defineProps<{
    task?: Task
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit', data: TaskCreate): void
}>()

// Form state
const loading = ref(false)
const form = ref({
    title: props.task?.title || '',
    description: props.task?.description || '',
    deadline: props.task?.deadline
        ? new Date(props.task.deadline).toISOString().slice(0, 16)
        : ''
})

// Form validation
const errors = ref({
    title: '',
    description: '',
    deadline: ''
})

// Computed
const minDate = computed(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
})

// Methods
const validateForm = () => {
    errors.value = {
        title: '',
        description: '',
        deadline: ''
    }

    if (!form.value.title.trim()) {
        errors.value.title = 'Title is required'
    } else if (form.value.title.length < 3) {
        errors.value.title = 'Title must be at least 3 characters'
    }

    if (!form.value.description.trim()) {
        errors.value.description = 'Description is required'
    } else if (form.value.description.length < 10) {
        errors.value.description = 'Description must be at least 10 characters'
    }

    if (!form.value.deadline) {
        errors.value.deadline = 'Deadline is required'
    } else {
        const deadlineDate = new Date(form.value.deadline)
        if (deadlineDate <= new Date()) {
            errors.value.deadline = 'Deadline must be in the future'
        }
    }

    return !Object.values(errors.value).some(error => error)
}

const handleSubmit = () => {
    if (!validateForm()) return

    loading.value = true
    emit('submit', {
        title: form.value.title,
        description: form.value.description,
        deadline: new Date(form.value.deadline).toISOString()
    })
}
</script>
