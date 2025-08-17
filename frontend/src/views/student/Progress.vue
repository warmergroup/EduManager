<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Progress</h1>
                <p class="mt-2 text-gray-600">O'qish jarayonidagi natijalaringiz va statistikalar</p>
            </div>

            <!-- Progress Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-lg">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                                </path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Jami Vazifalar</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ progress.totalTasks || 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-lg">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Topshirilgan</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ progress.submittedTasks || 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-100 rounded-lg">
                            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Kutilmoqda</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ progress.pendingGrades || 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-lg">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                                </path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">O'rtacha Ball</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ progress.averageScore || 0 }}/100</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Progress Chart -->
            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Umumiy Progress</h3>
                <div class="relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                        <div>
                            <span
                                class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Tamamlanish
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-semibold inline-block text-blue-600">
                                {{ progress.completionPercentage || 0 }}%
                            </span>
                        </div>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div :style="{ width: `${progress.completionPercentage || 0}%` }"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Submissions -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">So'nggi Topshiriqlar</h3>
                </div>
                <div class="divide-y divide-gray-200">
                    <div v-if="loading" class="p-6 text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">Yuklanmoqda...</p>
                    </div>

                    <div v-else-if="recentSubmissions.length === 0" class="p-6 text-center">
                        <p class="text-gray-500">Hali hech qanday topshiriq yo'q</p>
                    </div>

                    <div v-else v-for="submission in recentSubmissions" :key="submission.id" class="p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-900">{{ submission.taskTitle }}</p>
                                    <p class="text-sm text-gray-500">{{ formatDate(submission.createdAt) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span v-if="submission.isGraded"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {{ submission.score }}/100
                                </span>
                                <span v-else
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Kutilmoqda
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
// import { useSubmissionsStore } from '@/stores/submissions'

const progressStore = useProgressStore()
// const submissionsStore = useSubmissionsStore()

const loading = ref(false)
const recentSubmissions = ref<any[]>([])

const progress = computed(() => progressStore.progress)

const formatDate = (date: string | Date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('uz-UZ')
}

const loadRecentSubmissions = async () => {
    try {
        loading.value = true
        // TODO: Load recent submissions from API
        // recentSubmissions.value = await submissionsStore.getRecentSubmissions()
    } catch (error) {
        console.error('Error loading recent submissions:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await progressStore.fetchProgress()
    await loadRecentSubmissions()
})
</script>
