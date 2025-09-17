<template>
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <PageHeader :title="t('centers.title')" :description="t('centers.description')">
            <button @click="showCreateModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ t('centers.createCenter') }}
            </button>
        </PageHeader>

        <!-- Search and Filters -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <input v-model="searchQuery" type="text" :placeholder="t('common.search')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div class="flex gap-2">
                <select v-model="statusFilter"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{{ t('common.allStatus') }}</option>
                    <option value="active">{{ t('common.active') }}</option>
                    <option value="inactive">{{ t('common.inactive') }}</option>
                </select>
            </div>
        </div>

        <!-- Centers List -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">{{ t('common.loading') }}...</p>
        </div>

        <div v-else-if="centers.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                    </path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('centers.noCenters') }}</h3>
            <p class="text-gray-600 mb-4">{{ t('centers.noCentersDescription') }}</p>
            <button @click="showCreateModal = true"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {{ t('centers.createCenter') }}
            </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="center in filteredCenters" :key="center._id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ center.name }}</h3>
                        <p class="text-sm text-gray-600">{{ center.email }}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="center.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ center.isActive ? t('common.active') : t('common.inactive') }}
                    </span>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {{ center.address }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                            </path>
                        </svg>
                        {{ center.phone }}
                    </div>
                    <div v-if="center.website" class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                        </svg>
                        <a :href="center.website" target="_blank" class="text-blue-600 hover:underline">
                            {{ center.website }}
                        </a>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="text-sm text-gray-500">
                        {{ t('centers.created') }}: {{ formatDate(center.createdAt) }}
                    </div>
                    <div class="flex space-x-2">
                        <button @click="editCenter(center)"
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            {{ t('common.edit') }}
                        </button>
                        <button @click="deleteCenter(center._id)"
                            class="text-red-600 hover:text-red-800 text-sm font-medium">
                            {{ t('common.delete') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
            <div class="flex space-x-2">
                <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ t('common.previous') }}
                </button>

                <span v-for="page in visiblePages" :key="page" @click="currentPage = page"
                    class="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
                    :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
                    {{ page }}
                </span>

                <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ t('common.next') }}
                </button>
            </div>
        </div>

        <!-- Create Center Modal -->
        <CreateCenterModal v-if="showCreateModal" @close="showCreateModal = false" @created="handleCenterCreated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCentersStore } from '@/stores/centers'
import PageHeader from '@/components/common/PageHeader.vue'
import CreateCenterModal from '@/components/admin/CreateCenterModal.vue'

const { t } = useI18n()

const centersStore = useCentersStore()

const loading = ref(false)
const centers = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(0)
const showCreateModal = ref(false)

const filteredCenters = computed(() => {
    let filtered = centers.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(center =>
            center.name.toLowerCase().includes(query) ||
            center.email.toLowerCase().includes(query) ||
            center.address.toLowerCase().includes(query)
        )
    }

    if (statusFilter.value) {
        filtered = filtered.filter(center =>
            statusFilter.value === 'active' ? center.isActive : !center.isActive
        )
    }

    return filtered
})

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ')
}

const fetchCenters = async () => {
    try {
        loading.value = true
        await centersStore.fetchCenters({
            page: currentPage.value,
            limit: pageSize.value
        })
        centers.value = centersStore.centers
        totalPages.value = centersStore.totalPages
    } catch (error) {
        console.error('Error fetching centers:', error)
    } finally {
        loading.value = false
    }
}

const editCenter = (center: any) => {
    // TODO: Implement edit functionality
    console.log('Edit center:', center)
}

const deleteCenter = async (centerId: string) => {
    if (confirm('Are you sure you want to delete this center?')) {
        try {
            await centersStore.deleteCenter(centerId)
            await fetchCenters()
        } catch (error) {
            console.error('Error deleting center:', error)
        }
    }
}

const handleCenterCreated = () => {
    showCreateModal.value = false
    fetchCenters()
}

watch(currentPage, () => {
    fetchCenters()
})

onMounted(() => {
    fetchCenters()
})
</script>
