<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import FileUpload from '@/components/FileUpload.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const { showToast } = useToast()

interface TaskForm {
    title: string
    description: string
    deadline: string
    file?: File
}

const form = reactive<TaskForm>({
    title: '',
    description: '',
    deadline: ''
})

const errors = reactive({
    title: '',
    description: '',
    deadline: ''
})

const loading = ref(false)

const validateForm = (): boolean => {
    errors.title = ''
    errors.description = ''
    errors.deadline = ''

    if (!form.title.trim()) {
        errors.title = 'Vazifa nomi kiritilishi shart'
        return false
    }

    if (form.title.length < 3) {
        errors.title = 'Vazifa nomi kamida 3 belgidan iborat bo\'lishi kerak'
        return false
    }

    if (!form.description.trim()) {
        errors.description = 'Vazifa tavsifi kiritilishi shart'
        return false
    }

    if (form.description.length < 10) {
        errors.description = 'Vazifa tavsifi kamida 10 belgidan iborat bo\'lishi kerak'
        return false
    }

    if (!form.deadline) {
        errors.deadline = 'Muddati belgilanishi shart'
        return false
    }

    const deadlineDate = new Date(form.deadline)
    if (deadlineDate <= new Date()) {
        errors.deadline = 'Muddati hozirgi vaqtdan keyin bo\'lishi kerak'
        return false
    }

    return true
}

const handleFileSelected = (file: File) => {
    form.file = file
}

const handleFileRemoved = () => {
    form.file = undefined
}

const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true

    try {
        await tasksStore.createTask({
            title: form.title,
            description: form.description,
            deadline: form.deadline,
            file: form.file
        })

        showToast('Vazifa muvaffaqiyatli yaratildi!', 'success')
        router.push('/teacher/tasks')
    } catch (error: any) {
        showToast(error.message || 'Vazifa yaratishda xatolik yuz berdi', 'error')
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div class="create-task-page">
        <div class="max-w-4xl mx-auto p-6">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Yangi Vazifa Yaratish</h1>
                <p class="text-gray-600">Talabalarga bajarish uchun yangi vazifa yarating</p>
            </div>
            <PageHeader :title="$t('dashboard.teacher.title')" :description="$t('dashboard.teacher.description')" />
            <!-- Create Task Form -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            Vazifa nomi *
                        </label>
                        <input id="title" v-model="form.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            :class="{ 'border-red-500': errors.title }" placeholder="Vazifa nomini kiriting..." />
                        <p v-if="errors.title" class="mt-1 text-sm text-red-600">
                            {{ errors.title }}
                        </p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            Vazifa tavsifi *
                        </label>
                        <textarea id="description" v-model="form.description" rows="4" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            :class="{ 'border-red-500': errors.description }"
                            placeholder="Vazifa haqida batafsil ma'lumot bering..."></textarea>
                        <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                            {{ errors.description }}
                        </p>
                    </div>

                    <!-- Deadline -->
                    <div>
                        <label for="deadline" class="block text-sm font-medium text-gray-700 mb-2">
                            Muddati *
                        </label>
                        <input id="deadline" v-model="form.deadline" type="datetime-local" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            :class="{ 'border-red-500': errors.deadline }" />
                        <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">
                            {{ errors.deadline }}
                        </p>
                    </div>

                    <!-- File Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Vazifa fayli (ixtiyoriy)
                        </label>
                        <FileUpload @file-selected="handleFileSelected" @file-removed="handleFileRemoved"
                            accept="image/*,.pdf,.doc,.docx" :max-size="10 * 1024 * 1024" />
                        <p class="mt-2 text-sm text-gray-500">
                            Rasm, PDF yoki Word hujjat yuklashingiz mumkin. Maksimal hajm: 10MB
                        </p>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button type="button" @click="$router.push('/teacher/tasks')"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Bekor qilish
                        </button>
                        <button type="submit" :disabled="loading"
                            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Yaratilmoqda...
                            </span>
                            <span v-else>Vazifani yaratish</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* .create-task-page {
    @apply min-h-screen bg-gray-50;
} */
</style>
