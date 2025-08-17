<script setup lang="ts">
import { ref } from 'vue'
import type { Task, SubmissionData } from '@/types'

const props = defineProps<{
    task: Task
    submission?: SubmissionData
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit', taskId: string, file: File): void
}>()

const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) selectedFile.value = file
}

const submit = () => {
    if (selectedFile.value) {
        emit('submit', props.task._id, selectedFile.value)
    }
}
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">{{ task.title }}</h2>
            <div class="mb-4">{{ task.description }}</div>

            <div v-if="!submission" class="mb-4">
                <input type="file" @change="handleFileChange" />
            </div>

            <div v-else class="mb-4">
                <p>Submitted at: {{ new Date(submission.submittedAt).toLocaleString() }}</p>
            </div>

            <div class="flex justify-end gap-2">
                <button @click="$emit('close')" class="px-4 py-2 border rounded">Close</button>
                <button v-if="!submission && selectedFile" @click="submit"
                    class="px-4 py-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>
