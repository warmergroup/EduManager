<template>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
        <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            @keyup.enter="$emit('search', modelValue)" type="text" :placeholder="placeholder"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <div v-if="showClear && modelValue" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button @click="clearSearch" class="text-gray-400 hover:text-gray-600" type="button">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string
    placeholder?: string
    showClear?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Qidirish...',
    showClear: true
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'search': [query: string]
}>()

const clearSearch = () => {
    emit('update:modelValue', '')
    emit('search', '')
}
</script>
