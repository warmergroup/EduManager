<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CpuChipIcon,
  UserIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const { user } = authStore

const isTeacher = computed(() => user?.role === 'teacher')

const studentNavigation = [
  { name: 'StudentDashboard', label: 'Dashboard', to: '/student/dashboard', icon: HomeIcon },
  { name: 'StudentTasks', label: 'Vazifalar', to: '/student/tasks', icon: DocumentTextIcon },
  { name: 'StudentSubmissions', label: 'Topshiriqlar', to: '/student/submissions', icon: AcademicCapIcon },
  { name: 'StudentVideos', label: 'Video Darslar', to: '/student/videos', icon: VideoCameraIcon },
  { name: 'StudentProgress', label: 'Progress', to: '/student/progress', icon: ChartBarIcon },
  { name: 'StudentAI', label: 'AI Yordamchisi', to: '/student/ai', icon: ChatBubbleLeftRightIcon },
  { name: 'StudentProfile', label: 'Profil', to: '/student/profile', icon: UserIcon }
]

const teacherNavigation = [
  { name: 'TeacherDashboard', label: 'Dashboard', to: '/teacher/dashboard', icon: HomeIcon },
  { name: 'TeacherTasks', label: 'Vazifalar', to: '/teacher/tasks', icon: DocumentTextIcon },
  { name: 'TeacherSubmissions', label: 'Topshiriqlar', to: '/teacher/submissions', icon: AcademicCapIcon },
  { name: 'TeacherVideos', label: 'Video Menejeri', to: '/teacher/videos', icon: VideoCameraIcon },
  { name: 'TeacherStudents', label: 'Student\'lar', to: '/teacher/students', icon: UsersIcon },
  { name: 'TeacherAnalytics', label: 'Analitika', to: '/teacher/analytics', icon: ChartBarIcon },
  { name: 'TeacherAI', label: 'AI Generator', to: '/teacher/ai', icon: CpuChipIcon },
  { name: 'TeacherProfile', label: 'Profil', to: '/teacher/profile', icon: UserIcon }
]

const navigationItems = computed(() => {
  return isTeacher ? teacherNavigation : studentNavigation
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="bg-white h-full shadow-lg border-r border-gray-200 flex flex-col">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">
        {{ isTeacher ? 'Teacher Portal' : 'Student Portal' }}
      </h2>
      <p class="text-sm text-gray-600 mt-1">{{ user?.fullName }}</p>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link v-for="item in navigationItems" :key="item.name" :to="item.to"
        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors" :class="$route.name === item.name
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
          : 'text-gray-700 hover:bg-gray-50'">
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.label }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-gray-200">
      <button @click="handleLogout"
        class="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors">
        <ArrowLeftOnRectangleIcon class="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  </div>
</template>