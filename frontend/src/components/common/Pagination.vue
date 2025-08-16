<template>
    <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
            {{ startItem }} - {{ endItem }} dan {{ totalItems }} ta
        </div>
        <div class="flex space-x-2">
            <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
                Oldingi
            </button>

            <div class="flex space-x-1">
                <button v-for="page in visiblePages" :key="page" @click="$emit('page-change', page)" :class="[
                    'px-3 py-1 border rounded text-sm',
                    page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                ]">
                    {{ page }}
                </button>
            </div>

            <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
                Keyingi
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
}

const props = defineProps<Props>()

defineEmits<{
    'page-change': [page: number]
}>()

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(props.totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})
</script>
