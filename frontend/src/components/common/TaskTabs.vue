<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    activeTab: string
    showSubmissionsTab?: boolean
}

interface Emits {
    (e: 'tab-change', tab: string): void
}

const props = withDefaults(defineProps<Props>(), {
    showSubmissionsTab: true
})

const emit = defineEmits<Emits>()

const handleTabChange = (tab: string) => {
    emit('tab-change', tab)
}
</script>

<template>
    <div class="mb-6">
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
                <button @click="handleTabChange('tasks')" :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'tasks'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    📝 {{ $t('tasks.tasks') }}
                </button>
                <button v-if="showSubmissionsTab" @click="handleTabChange('submissions')" :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'submissions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    📤 {{ $t('tasks.submittedTasks') }}
                </button>
            </nav>
        </div>
    </div>
</template>
