<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  HomeIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CpuChipIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/sidebar'
import DeveloperInfo from '@/components/DeveloperInfo.vue'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()

const user = computed(() => authStore.user)
const isTeacher = computed(() => user.value?.role === 'teacher')

// dev info faqat transition tugagach ko‘rinishi uchun flag
const showDevInfo = ref(false)

const studentNavigation = [
  { name: 'StudentDashboard', label: 'Dashboard', to: '/student/dashboard', icon: HomeIcon },
  { name: 'StudentTasks', label: 'Vazifalar', to: '/student/tasks', icon: DocumentTextIcon },
  { name: 'StudentVideos', label: 'Video Darslar', to: '/student/videos', icon: VideoCameraIcon },
  { name: 'StudentAI', label: 'AI Yordamchisi', to: '/student/ai', icon: ChatBubbleLeftRightIcon },
  { name: 'StudentProfile', label: 'Profil', to: '/student/profile', icon: UserIcon }
]

const teacherNavigation = [
  { name: 'TeacherDashboard', label: 'Dashboard', to: '/teacher/dashboard', icon: HomeIcon },
  { name: 'TeacherTasks', label: 'Vazifalar', to: '/teacher/tasks', icon: DocumentTextIcon },
  { name: 'TeacherVideos', label: 'Video Menejeri', to: '/teacher/videos', icon: VideoCameraIcon },
  { name: 'TeacherStudents', label: "Student'lar", to: '/teacher/students', icon: UsersIcon },
  { name: 'TeacherAI', label: 'AI Generator', to: '/teacher/ai', icon: CpuChipIcon },
  { name: 'TeacherProfile', label: 'Profil', to: '/teacher/profile', icon: UserIcon }
]

const navigationItems = computed(() => {
  if (!user.value?.role) return []
  return isTeacher.value ? teacherNavigation : studentNavigation
})

const handleLogout = () => {
  authStore.logout()
}

const handleClickOutside = (event: Event) => {
  if (sidebarStore.isMobile && sidebarStore.isOpen) {
    const target = event.target as HTMLElement
    if (!target.closest('.sidebar') && !target.closest('.hamburger-btn')) {
      sidebarStore.close()
    }
  }
}

const handleResize = () => {
  sidebarStore.checkMobile()
}

onMounted(() => {
  sidebarStore.checkMobile()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})


const handleTransitionEnd = () => {
  // Sidebar ochilganda ko‘rsatish
  if (!sidebarStore.isCollapsed) {
    showDevInfo.value = true
  } else {
    showDevInfo.value = false
  }
}

watch(() => sidebarStore.isCollapsed, (collapsed) => {
  if (collapsed) {
    // Yopilish boshlansa → darrov yo‘qoladi
    showDevInfo.value = false
  } else {
    // Ochilgandan keyin kechikib chiqsin
    showDevInfo.value = true
    setTimeout(() => {
    }, 100) // sidebar transition tugashiga yaqinroq
  }
})

</script>

<template>
  <!-- Mobile Overlay -->
  <div v-if="sidebarStore.isMobile && sidebarStore.isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" @click="sidebarStore.close"></div>

  <!-- Sidebar -->
  <aside
    class="sidebar fixed lg:relative top-0 left-0 h-full lg:h-[90vh] z-50 bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out"
    :class="[
      sidebarStore.isMobile
        ? (sidebarStore.isOpen ? 'translate-x-0 w-[70vw]' : '-translate-x-full w-[70vw]')
        : (sidebarStore.isCollapsed ? 'w-16' : 'w-60')
    ]" @transitionend="handleTransitionEnd" @click.stop>

    <!-- Header (only mobile) -->
    <div v-if="sidebarStore.isMobile" class="flex items-center justify-between p-4 border-b border-gray-200">
      <p class="font-semibold">{{ user?.fullName }}</p>
      <button @click="sidebarStore.close" class="text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-2 overflow-y-auto">
      <template v-if="user?.role">
        <router-link v-for="item in navigationItems" :key="item.name" :to="item.to"
          class="flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group"
          :class="[
            $route.name === item.name
              ? 'bg-blue-100 text-blue-700 lg:border-r-2 border-blue-600'
              : 'text-gray-700 hover:bg-blue-50',
            sidebarStore.isCollapsed && !sidebarStore.isMobile ? 'justify-center px-2' : ''
          ]" @click="sidebarStore.isMobile && sidebarStore.close()">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="[
            sidebarStore.isCollapsed && !sidebarStore.isMobile ? 'mr-0' : 'mr-3',
            $route.name === item.name ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'
          ]" />
          <span v-if="!sidebarStore.isCollapsed || sidebarStore.isMobile"
            class="transition-all duration-300 whitespace-nowrap">
            {{ item.label }}
          </span>
        </router-link>
      </template>
    </nav>

    <!-- Developer Info -->
    <Transition name="fade">
      <div v-if="showDevInfo" class="absolute bottom-20">
        <DeveloperInfo />
      </div>
    </Transition>

    <!-- Logout Section -->
    <div class="absolute bottom-0 left-0 py-4 border-t border-gray-200">
      <button @click="handleLogout"
        class="flex items-center justify-start w-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 group"
        :class="sidebarStore.isCollapsed && !sidebarStore.isMobile ? 'justify-center px-2' : ''">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          :class="[sidebarStore.isCollapsed && !sidebarStore.isMobile ? 'mr-0' : 'mr-3']">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="!sidebarStore.isCollapsed || sidebarStore.isMobile">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  min-height: 90vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
