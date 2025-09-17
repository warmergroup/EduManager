<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCentersStore } from '@/stores/centers'
import PageHeader from '@/components/common/PageHeader.vue'
import CreateCenterModal from '@/components/admin/CreateCenterModal.vue'

const { t } = useI18n()

const centersStore = useCentersStore()

const stats = ref({
    totalCenters: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalGroups: 0
})

const recentCenters = ref<any[]>([])
const loading = ref(false)
const showCreateCenterModal = ref(false)

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ')
}

const fetchStats = async () => {
    try {
        loading.value = true
        await centersStore.fetchCenters({ limit: 5 })
        recentCenters.value = centersStore.centers

        // Calculate stats
        stats.value.totalCenters = centersStore.totalCenters
        // TODO: Add other stats from API
    } catch (error) {
        console.error('Error fetching stats:', error)
    } finally {
        loading.value = false
    }
}

const handleCenterCreated = () => {
    showCreateCenterModal.value = false
    fetchStats()
}

onMounted(() => {
    fetchStats()
})
</script>

<template>
    <div class="max-w-7xl mx-auto min-w-0 overflow-x-hidden">
        <!-- Header -->
        <PageHeader :title="t('admin.dashboard.title')" :description="t('admin.dashboard.description')" />

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 min-w-0">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">{{ t('admin.dashboard.totalCenters') }}</p>
                        <p class="text-3xl font-bold text-gray-900">{{ stats.totalCenters || 0 }}</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">{{ t('admin.dashboard.totalTeachers') }}</p>
                        <p class="text-3xl font-bold text-gray-900">{{ stats.totalTeachers || 0 }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">{{ t('admin.dashboard.totalStudents') }}</p>
                        <p class="text-3xl font-bold text-gray-900">{{ stats.totalStudents || 0 }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">{{ t('admin.dashboard.totalGroups') }}</p>
                        <p class="text-3xl font-bold text-gray-900">{{ stats.totalGroups || 0 }}</p>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Create Center Card -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('admin.dashboard.quickActions') }}</h3>
                <div class="space-y-3">
                    <button @click="showCreateCenterModal = true"
                        class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {{ t('centers.createCenter') }}
                    </button>

                    <button @click="$router.push('/admin/centers')"
                        class="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                        {{ t('centers.title') }}
                    </button>
                </div>
            </div>

            <!-- Recent Centers -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('admin.dashboard.recentCenters') }}</h3>
                <div v-if="loading" class="text-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
                <div v-else-if="recentCenters.length === 0" class="text-center py-4 text-gray-500">
                    {{ t('centers.noCenters') }}
                </div>
                <div v-else class="space-y-3">
                    <div v-for="center in recentCenters" :key="center._id"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <h4 class="font-medium text-gray-900">{{ center.name }}</h4>
                            <p class="text-sm text-gray-600">{{ center.email }}</p>
                        </div>
                        <span class="text-xs text-gray-500">
                            {{ formatDate(center.createdAt) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Center Modal -->
        <CreateCenterModal v-if="showCreateCenterModal" @close="showCreateCenterModal = false"
            @created="handleCenterCreated" />
    </div>
</template>