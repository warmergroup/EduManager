<template>
    <div class="grading-form">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Score Input -->
            <div>
                <label for="score" class="block text-sm font-medium text-gray-700 mb-2">
                    Baho (0-100)
                </label>
                <input id="score" v-model="form.score" type="number" min="0" max="100" step="1" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.score }" placeholder="Masalan: 85" />
                <p v-if="errors.score" class="mt-1 text-sm text-red-600">
                    {{ errors.score }}
                </p>
            </div>

            <!-- Feedback Input -->
            <div>
                <label for="feedback" class="block text-sm font-medium text-gray-700 mb-2">
                    Izoh va tavsiyalar
                </label>
                <textarea id="feedback" v-model="form.feedback" rows="4" maxlength="500"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.feedback }"
                    placeholder="Talabaning ishini baholab, izoh va tavsiyalar bering..."></textarea>
                <div class="flex justify-between items-center mt-1">
                    <p v-if="errors.feedback" class="text-sm text-red-600">
                        {{ errors.feedback }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ form.feedback.length }}/500
                    </p>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-3">
                <button type="button" @click="$emit('cancel')"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Bekor qilish
                </button>
                <button type="submit" :disabled="loading"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="loading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Baholash...
                    </span>
                    <span v-else>Baholash</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface GradingForm {
    score: number | null
    feedback: string
}

interface Props {
    submissionId: string
    initialScore?: number
    initialFeedback?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialScore: undefined,
    initialFeedback: ''
})

const emit = defineEmits<{
    'graded': [submissionId: string, score: number, feedback: string]
    'cancel': []
}>()

const loading = ref(false)
const errors = reactive({
    score: '',
    feedback: ''
})

const form = reactive<GradingForm>({
    score: props.initialScore || null,
    feedback: props.initialFeedback
})

const validateForm = (): boolean => {
    errors.score = ''
    errors.feedback = ''

    if (form.score === null || form.score < 0 || form.score > 100) {
        errors.score = 'Baho 0-100 oralig\'ida bo\'lishi kerak'
        return false
    }

    if (!form.feedback.trim()) {
        errors.feedback = 'Izoh kiritish majburiy'
        return false
    }

    if (form.feedback.length > 500) {
        errors.feedback = 'Izoh 500 belgidan oshmasligi kerak'
        return false
    }

    return true
}

const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true

    try {
        // Emit the grading data
        emit('graded', props.submissionId, form.score!, form.feedback)
    } catch (error) {
        console.error('Grading error:', error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* .grading-form {
    @apply w-full max-w-2xl mx-auto;
} */
</style>
