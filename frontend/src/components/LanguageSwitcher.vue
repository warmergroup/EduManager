<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { LanguageIcon } from '@heroicons/vue/24/outline'

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
                class="flex items-center px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <LanguageIcon class="w-5 h-5 text-gray-600" />
            </button>

            <!-- Dropdown menu -->
            <div v-if="isDropdownOpen"
                class="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="py-1">
                    <button v-for="language in languageStore.availableLanguages" :key="language.code"
                        @click="selectLanguage(language.code)"
                        class="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                        :class="{
                            'bg-blue-50 text-blue-600':
                                language.code === languageStore.currentLanguage
                        }">
                        <span class="text-sm font-bold text-blue-600">{{ language.icon }}</span>
                        <span class="text-sm font-medium">{{ language.name }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile version -->
        <div class="md:hidden">
            <button @click="toggleDropdown"
                class="flex items-center px-2 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <LanguageIcon class="w-5 h-5 text-gray-600" />
            </button>

            <!-- Mobile dropdown menu -->
            <div v-if="isDropdownOpen"
                class="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="py-1">
                    <button v-for="language in languageStore.availableLanguages" :key="language.code"
                        @click="selectLanguage(language.code)"
                        class="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                        :class="{
                            'bg-blue-50 text-blue-600':
                                language.code === languageStore.currentLanguage
                        }">
                        <span class="text-sm font-bold text-blue-600">{{ language.icon }}</span>
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
