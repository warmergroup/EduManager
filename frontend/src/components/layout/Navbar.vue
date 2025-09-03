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
    'StudentDashboard': 'navigation.studentDashboard',
    'StudentTasks': 'navigation.studentTasks',
    'StudentSubmissions': 'navigation.submissions',
    'StudentVideos': 'navigation.studentVideos',
    'StudentAI': 'navigation.studentAI',
    'StudentProfile': 'navigation.studentProfile',

    // Teacher pages
    'TeacherDashboard': 'navigation.teacherDashboard',
    'TeacherTasks': 'navigation.teacherTasks',
    'TeacherSubmissions': 'navigation.submissions',
    'TeacherVideos': 'navigation.teacherVideos',
    'TeacherStudents': 'navigation.teacherStudents',
    'TeacherAI': 'navigation.teacherAI',
    'TeacherProfile': 'navigation.teacherProfile'
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

      <!-- Right side: Language Switcher + User Info + Logout -->
      <div class="flex items-center space-x-4">
        <!-- Language Switcher -->
        <LanguageSwitcher />

        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ user?.fullName?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="hidden sm:block text-sm font-medium text-gray-700">{{ user?.fullName }}</span>
        </div>

        <!-- Logout Button
        <button @click="authStore.logout"
          class="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span class="hidden sm:inline">Chiqish</span>
        </button> -->
      </div>
    </div>
  </header>
</template>