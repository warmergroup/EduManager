<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/sidebar'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const route = useRoute()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const { user } = authStore

const pageTitle = computed(() => {
  const routeName = route.name as string
  const titleKeys: { [key: string]: string } = {
    // Student pages
    'StudentDashboard': 'navigation.dashboard',
    'StudentTasks': 'navigation.tasks',
    'StudentSubmissions': 'navigation.submissions',
    'StudentVideos': 'navigation.videos',
    'StudentAI': 'navigation.AIassistant',
    'StudentProfile': 'navigation.profile',

    // Teacher pages
    'TeacherDashboard': 'navigation.dashboard',
    'TeacherTasks': 'navigation.tasks', 
    'TeacherSubmissions': 'navigation.submissions',
    'TeacherVideos': 'navigation.videos',
    'TeacherStudents': 'navigation.students',
    'TeacherAI': 'navigation.AIassistant',
    'TeacherProfile': 'navigation.profile'
  }
  const titleKey = titleKeys[routeName] || 'navigation.dashboard'
  return titleKey
})

const toggleSidebar = () => {
  sidebarStore.toggle()
}

const toggleDesktopSidebar = () => {
  if (!sidebarStore.isMobile) {
    sidebarStore.toggle()
  }
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left side: Hamburger + Desktop Toggle + Title -->
      <div class="flex items-center space-x-4">
        <!-- Hamburger Menu Button (Mobile) -->
        <button @click="toggleSidebar"
          class="hamburger-btn lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <!-- Desktop Sidebar Toggle Button -->
        <button @click="toggleDesktopSidebar"
          class="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          :title="sidebarStore.isCollapsed ? 'Sidebar\'ni ochish' : 'Sidebar\'ni yopish'">
          <svg v-if="sidebarStore.isCollapsed" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7">
            </path>
          </svg>
        </button>

        <!-- Page Title -->
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">
          {{ $t(pageTitle) }}
        </h1>
      </div>

      <!-- Right side: User Info + Language Switcher -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ user?.fullName?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="hidden sm:block text-sm font-medium text-gray-700">{{ user?.fullName }}</span>
        </div>

        <!-- Language Switcher -->
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>