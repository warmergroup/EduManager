<script setup lang="ts">

import TaskTabs from './TaskTabs.vue'
import FilterDropdown from './FilterDropdown.vue'
import Loading from '@/components/ui/Loading.vue'
import Alert from '@/components/ui/Alert.vue'

interface FilterOption {
    value: string
    label: string
    icon: string
    translationKey: string
}

interface Props {
    activeTab: string
    loading?: boolean
    error?: string | null
    showSubmissionsTab?: boolean
    filterOptions?: FilterOption[]
    currentFilter?: string
    showCreateButton?: boolean
    createButtonText?: string
    createButtonLink?: string
}

interface Emits {
    (e: 'tab-change', tab: string): void
    (e: 'filter-change', filter: string): void
    (e: 'create-task'): void
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: null,
    showSubmissionsTab: true,
    filterOptions: () => [],
    currentFilter: 'all',
    showCreateButton: false,
    createButtonText: 'Create Task',
    createButtonLink: '#'
})

const emit = defineEmits<Emits>()

const handleTabChange = (tab: string) => {
    emit('tab-change', tab)
}

const handleFilterChange = (filter: string) => {
    emit('filter-change', filter)
}

const handleCreateTask = () => {
    emit('create-task')
}
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('tasks.title') }}</h1>
            <p class="mt-2 text-gray-600">{{ $t('tasks.description') }}</p>
        </div>

        <!-- Error Display -->
        <Alert v-if="error" :show="!!error" type="error" title="Xatolik" :message="error" class="mb-6" />

        <!-- Tabs -->
        <TaskTabs :activeTab="activeTab" :showSubmissionsTab="showSubmissionsTab" @tab-change="handleTabChange" />

        <!-- Filter and Actions -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <!-- Filter Dropdown -->
                <FilterDropdown v-if="filterOptions.length > 0" :modelValue="currentFilter" :options="filterOptions"
                    @update:modelValue="handleFilterChange" />

                <!-- Simple Select for Teacher Tasks -->
                <select v-else-if="activeTab === 'submissions'" v-model="currentFilter"
                    @change="handleFilterChange(currentFilter)" class="px-4 py-2 border rounded-lg">
                    <option value="all">{{ $t('tasks.all') }}</option>
                    <option value="graded">✅ {{ $t('tasks.graded') }}</option>
                    <option value="pending">⏳ {{ $t('tasks.pending') }}</option>
                </select>
            </div>

            <!-- Create Task Button -->
            <router-link v-if="showCreateButton && activeTab === 'tasks'" :to="createButtonLink"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                📝 {{ createButtonText }}
            </router-link>

            <!-- Create Task Button (Event) -->
            <button v-else-if="showCreateButton && activeTab === 'tasks'" @click="handleCreateTask"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                📝 {{ createButtonText }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
            <Loading />
        </div>

        <!-- Content Slot -->
        <div v-else>
            <slot />
        </div>
    </div>
</template>
