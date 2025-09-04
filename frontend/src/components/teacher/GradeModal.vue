<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { SubmissionData } from '@/types'

interface Props {
    submission: SubmissionData
}

interface Emits {
    (e: 'close'): void
    (e: 'grade', data: { score: number; feedback: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const form = reactive({
    score: props.submission.score || 0,
    feedback: props.submission.feedback || ''
})

const handleSubmit = async () => {
    if (form.score < 0 || form.score > 100) {
        alert('Baho 0 dan 100 gacha bo\'lishi kerak')
        return
    }

    if (!form.feedback.trim()) {
        alert('Fikr bildirish majburiy')
        return
    }

    loading.value = true
    try {
        await emit('grade', {
            score: form.score,
            feedback: form.feedback.trim()
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">📝 {{ $t('tasks.gradeSubmission') }}</h3>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <!-- Submission Info -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">{{ $t('tasks.task') }}:</p>
                <p class="font-medium">{{ submission.taskTitle }}</p>
                <p class="text-sm text-gray-600 mb-1 mt-2">{{ $t('tasks.student') }}:</p>
                <p class="font-medium">{{ submission.studentName }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Score -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        🎯 {{ $t('tasks.score') }} (0-100)
                    </label>
                    <input v-model.number="form.score" type="number" min="0" max="100" step="1"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required>
                </div>

                <!-- Feedback -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        💬 {{ $t('tasks.feedback') }}
                    </label>
                    <textarea v-model="form.feedback" rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :placeholder="$t('tasks.feedbackPlaceholder')" required></textarea>
                </div>

                <!-- Buttons -->
                <div class="flex gap-3 pt-4">
                    <button type="button" @click="emit('close')"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        {{ $t('common.cancel') }}
                    </button>
                    <button type="submit" :disabled="loading"
                        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
                        {{ loading ? '⏳ ' + $t('common.saving') : '💾 ' + $t('tasks.saveGrade') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
