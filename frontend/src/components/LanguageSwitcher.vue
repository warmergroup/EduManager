<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const isDropdownOpen = ref(false)

// Dropdown ochish/yopish
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

// Dropdown yopish
const closeDropdown = () => {
    isDropdownOpen.value = false
}

// Til tanlash
const selectLanguage = (langCode: string) => {
    languageStore.setLanguage(langCode)
    closeDropdown()
}

// Click outside to close
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        closeDropdown()
    }
}

onMounted(() => {
    // localStorage dan til yuklash
    languageStore.loadLanguage()

    // Click outside listener
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>


<template>
    <div class="relative">
        <!-- Desktop version -->
        <div class="hidden md:block">
            <button @click="toggleDropdown"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <span class="text-lg">{{ languageStore.currentLanguageFlag }}</span>
                <svg class="w-4 h-4 text-gray-500 transition-transform duration-200"
                    :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <!-- Dropdown menu -->
            <div v-if="isDropdownOpen"
                class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="py-1">
                    <button v-for="language in languageStore.availableLanguages" :key="language.code"
                        @click="selectLanguage(language.code)"
                        class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                        :class="{
                            'bg-blue-50 text-blue-600':
                                language.code === languageStore.currentLanguage
                        }">
                        <span class="text-lg">{{ language.flag }}</span>
                        <span class="text-sm font-medium">{{ language.name }}</span>
                        <svg v-if="language.code === languageStore.currentLanguage"
                            class="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile version -->
        <div class="md:hidden">
            <button @click="toggleDropdown"
                class="flex items-center space-x-2 px-2 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <span class="text-lg">{{ languageStore.currentLanguageFlag }}</span>
                <svg class="w-4 h-4 text-gray-500 transition-transform duration-200"
                    :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <!-- Mobile dropdown menu -->
            <div v-if="isDropdownOpen"
                class="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="py-1">
                    <button v-for="language in languageStore.availableLanguages" :key="language.code"
                        @click="selectLanguage(language.code)"
                        class="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                        :class="{
                            'bg-blue-50 text-blue-600':
                                language.code === languageStore.currentLanguage
                        }">
                        <span class="text-lg">{{ language.flag }}</span>
                        <span class="text-sm font-medium">{{ language.name }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Overlay for mobile -->
        <div v-if="isDropdownOpen" @click="closeDropdown" class="fixed inset-0 z-40 md:hidden"></div>
    </div>
</template>



<style scoped>
/* Smooth transitions */
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.transition-transform {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}
</style>
