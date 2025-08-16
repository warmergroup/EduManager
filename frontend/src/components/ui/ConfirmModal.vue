<template>
    <div class="relative bg-white rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <p class="text-gray-600 mb-6">{{ message }}</p>

        <div class="flex justify-end gap-4">
            <button @click="$emit('cancel')" class="px-4 py-2 text-gray-600 hover:text-gray-700 border rounded-lg">
                Cancel
            </button>
            <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Confirm
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    message: string
}>()

defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()
</script>
