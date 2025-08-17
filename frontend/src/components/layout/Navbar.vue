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
      </div>
    </div>
  </header>
</template>