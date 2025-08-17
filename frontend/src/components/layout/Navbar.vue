<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { user } = authStore

const pageTitle = computed(() => {
  const routeName = route.name as string
  const titles: { [key: string]: string } = {
    // Student pages
    'StudentDashboard': 'Dashboard',
    'StudentTasks': 'Vazifalar',
    'StudentSubmissions': 'Topshiriqlar',
    'StudentVideos': 'Video Darslar',
    'StudentAI': 'AI Yordamchisi',
    'StudentProfile': 'Profil',

    // Teacher pages
    'TeacherDashboard': 'Dashboard',
    'TeacherTasks': 'Vazifalar',
    'TeacherSubmissions': 'Topshiriqlar',
    'TeacherVideos': 'Video Menejeri',
    'TeacherStudents': 'Student\'lar',
    'TeacherAI': 'AI Generator',
    'TeacherProfile': 'Profil'
  }
  return titles[routeName] || 'Dashboard'
})
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ pageTitle }}
      </h1>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ user?.fullName?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ user?.fullName }}</span>
        </div>

        <!-- Logout Button -->
        <button @click="authStore.logout"
          class="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Chiqish
        </button>
      </div>
    </div>
  </header>
</template>