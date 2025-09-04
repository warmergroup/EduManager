<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface FilterOption {
    value: string
    label: string
    icon: string
    translationKey: string
}

interface Props {
    modelValue: string
    options: FilterOption[]
    placeholder?: string
}

interface Emits {
    (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Filter'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const selectedOption = computed(() => {
    return props.options.find(option => option.value === props.modelValue) || props.options[0]
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectOption = (option: FilterOption) => {
    emit('update:modelValue', option.value)
    isOpen.value = false
}

const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="relative">
        <button @click="toggleDropdown"
            class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <span class="text-sm font-medium text-gray-700">
                {{ selectedOption.icon }} {{ $t(selectedOption.translationKey) }}
            </span>
            <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isOpen }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div v-if="isOpen"
            class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div class="py-1">
                <button v-for="option in options" :key="option.value" @click="selectOption(option)"
                    class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    :class="{ 'bg-blue-50 text-blue-600': modelValue === option.value }">
                    <span class="text-sm">{{ option.icon }}</span>
                    <span class="text-sm font-medium">{{ $t(option.translationKey) }}</span>
                </button>
            </div>
        </div>
    </div>
</template>
