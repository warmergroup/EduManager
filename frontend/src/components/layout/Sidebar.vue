<script setup lang="ts">
import { computed, onMounted } from 'vue'
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

const user = computed(() => authStore.user)
const isTeacher = computed(() => user.value?.role === 'teacher')

const studentNavigation = [
  { name: 'StudentDashboard', label: 'Dashboard', to: '/student/dashboard', icon: HomeIcon },
  { name: 'StudentTasks', label: 'Vazifalar', to: '/student/tasks', icon: DocumentTextIcon },
  // { name: 'StudentSubmissions', label: 'Topshiriqlar', to: '/student/submissions', icon: AcademicCapIcon },
  { name: 'StudentVideos', label: 'Video Darslar', to: '/student/videos', icon: VideoCameraIcon },
  { name: 'StudentAI', label: 'AI Yordamchisi', to: '/student/ai', icon: ChatBubbleLeftRightIcon },
  { name: 'StudentProfile', label: 'Profil', to: '/student/profile', icon: UserIcon }
]

const teacherNavigation = [
  { name: 'TeacherDashboard', label: 'Dashboard', to: '/teacher/dashboard', icon: HomeIcon },
  { name: 'TeacherTasks', label: 'Vazifalar', to: '/teacher/tasks', icon: DocumentTextIcon },
  { name: 'TeacherVideos', label: 'Video Menejeri', to: '/teacher/videos', icon: VideoCameraIcon },
  { name: 'TeacherStudents', label: 'Student\'lar', to: '/teacher/students', icon: UsersIcon },
  { name: 'TeacherAI', label: 'AI Generator', to: '/teacher/ai', icon: CpuChipIcon },
  { name: 'TeacherProfile', label: 'Profil', to: '/teacher/profile', icon: UserIcon }
]

const navigationItems = computed(() => {
  // Ensure user role exists
  if (!user.value?.role) {
    console.warn('User role is undefined, showing empty navigation')
    return []
  }

  const items = isTeacher.value ? teacherNavigation : studentNavigation
  return items
})

const handleNavigation = (to: string) => {
  // Validate route before navigation
  if (!user.value?.role) {
    console.error('Cannot navigate: user role is undefined')
    return
  }

  router.push(to)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="bg-white min-h-[90vh] shadow-lg border-r border-gray-200 flex flex-col">
    <nav class="flex-1 p-4 space-y-2">
      <template v-if="user?.role">
        <router-link v-for="item in navigationItems" :key="item.name" :to="item.to"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors" :class="$route.name === item.name
            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
            : 'text-gray-700 hover:bg-gray-50'">
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.label }}
        </router-link>
      </template>
      <div v-else class="text-center py-4 text-gray-500">
        <p>Navigation yuklanmoqda...</p>
      </div>
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