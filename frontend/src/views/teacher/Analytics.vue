<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'

const loading = ref(false)
const analytics = ref({
    totalTasks: 0,
    totalVideos: 0,
    totalSubmissions: 0,
    averageScore: 0
})

const recentTasks = ref([
    { id: 1, title: 'Matematika vazifasi', submissionCount: 15, completionRate: 80 },
    { id: 2, title: 'Fizika loyihasi', submissionCount: 12, completionRate: 65 },
    { id: 3, title: 'Ingliz tili', submissionCount: 18, completionRate: 90 }
])

const monthlyActivity = ref([
    { name: 'Yanvar', count: 25, percentage: 80 },
    { name: 'Fevral', count: 30, percentage: 95 },
    { name: 'Mart', count: 22, percentage: 70 },
    { name: 'Aprel', count: 28, percentage: 85 }
])

const recentActivity = ref([
    { id: 1, type: 'task', description: 'Yangi vazifa yaratildi: "Matematika vazifasi"', createdAt: new Date() },
    { id: 2, type: 'grade', description: '5 ta topshiriq baholandi', createdAt: new Date(Date.now() - 86400000) },
    { id: 3, type: 'video', description: "Video dars qo'shildi: 'Fizika asoslari'", createdAt: new Date(Date.now() - 172800000) }
])

const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
        task: 'TaskIcon',
        grade: 'GradeIcon',
        video: 'VideoIcon'
    }
    return icons[type] || 'TaskIcon'
}

const getActivityIconClass = (type: string) => {
    const classes: Record<string, string> = {
        task: 'bg-blue-500',
        grade: 'bg-green-500',
        video: 'bg-purple-500'
    }
    return classes[type] || 'bg-gray-500'
}

const formatDate = (date: string | Date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('uz-UZ')
}

const loadAnalytics = async () => {
    try {
        loading.value = true
        // TODO: Load analytics data from API
        // analytics.value = await api.getTeacherAnalytics()
    } catch (error) {
        console.error('Error loading analytics:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadAnalytics()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Analitika</h1>
                <p class="mt-2 text-gray-600">O'qituvchilik faoliyatidagi statistikalar va natijalar</p>
            </div>
            <PageHeader :title="$t('dashboard.teacher.title')" :description="$t('dashboard.teacher.description')" />
            <!-- Overview Cards -->
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
                            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalTasks || 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-lg">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Video Darslar</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalVideos || 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-100 rounded-lg">
                            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Topshiriqlar</p>
                            <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalSubmissions || 0 }}</p>
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
                            <p class="text-2xl font-semibold text-gray-900">{{ analytics.averageScore || 0 }}/100</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Task Completion Chart -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Vazifalar Bajarilishi</h3>
                    <div class="space-y-4">
                        <div v-for="task in recentTasks" :key="task.id" class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                                <p class="text-xs text-gray-500">{{ task.submissionCount }} ta topshiriq</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-24 bg-gray-200 rounded-full h-2">
                                    <div :style="{ width: `${task.completionRate}%` }"
                                        class="bg-blue-600 h-2 rounded-full transition-all duration-500"></div>
                                </div>
                                <span class="text-xs text-gray-600 w-12">{{ task.completionRate }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Monthly Activity Chart -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Oylik Faollik</h3>
                    <div class="space-y-4">
                        <div v-for="month in monthlyActivity" :key="month.name"
                            class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">{{ month.name }}</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-32 bg-gray-200 rounded-full h-2">
                                    <div :style="{ width: `${month.percentage}%` }"
                                        class="bg-green-600 h-2 rounded-full transition-all duration-500"></div>
                                </div>
                                <span class="text-xs text-gray-600 w-12">{{ month.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">So'nggi Faollik</h3>
                </div>
                <div class="divide-y divide-gray-200">
                    <div v-if="loading" class="p-6 text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">Yuklanmoqda...</p>
                    </div>

                    <div v-else-if="recentActivity.length === 0" class="p-6 text-center">
                        <p class="text-gray-500">Hali hech qanday faollik yo'q</p>
                    </div>

                    <div v-else v-for="activity in recentActivity" :key="activity.id" class="p-6">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                                    :class="getActivityIconClass(activity.type)">
                                    <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-gray-900">{{ activity.description }}</p>
                                <p class="text-xs text-gray-500">{{ formatDate(activity.createdAt) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>