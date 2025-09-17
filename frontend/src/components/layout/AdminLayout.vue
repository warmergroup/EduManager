<template>
    <div class="min-h-screen bg-gray-50 overflow-x-hidden">
        <!-- Sidebar -->
        <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex-shrink-0">
            <div class="flex h-full flex-col">
                <!-- Logo -->
                <div class="flex h-16 items-center justify-center border-b border-gray-200">
                    <h1 class="text-xl font-bold text-gray-900">🎓 EduManager</h1>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 space-y-1 p-4">
                    <router-link to="/admin/dashboard"
                        class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        :class="[
                            $route.name === 'AdminDashboard'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        ]">
                        <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                        </svg>
                        {{ t('admin.navigation.dashboard') }}
                    </router-link>

                    <router-link to="/admin/centers"
                        class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        :class="[
                            $route.name === 'AdminCenters'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        ]">
                        <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                        {{ t('centers.title') }}
                    </router-link>

                    <router-link to="/admin/groups"
                        class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        :class="[
                            $route.name === 'AdminGroups'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        ]">
                        <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        {{ t('groups.title') }}
                    </router-link>
                </nav>

                <!-- User Info -->
                <div class="border-t border-gray-200 p-4">
                    <div class="flex items-center space-x-3">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-blue-600">
                                {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() }}
                            </span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                                {{ authStore.user?.fullName }}
                            </p>
                            <p class="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                    <button @click="handleLogout"
                        class="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                            </path>
                        </svg>
                        {{ t('common.logout') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="pl-64 min-w-0 flex-1">
            <!-- Top Bar -->
            <div
                class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 min-w-0">
                <div class="flex items-center space-x-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                        {{ getPageTitle() }}
                    </h2>
                </div>

                <div class="flex items-center space-x-4">
                    <!-- Language Switcher -->
                    <LanguageSwitcher />

                    <!-- Notifications -->
                    <button class="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-5 5v-5zM4.5 19.5L9 15l4.5 4.5L18 15l4.5 4.5"></path>
                        </svg>
                        <span
                            class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">3</span>
                    </button>
                </div>
            </div>

            <!-- Page Content -->
            <main class="p-6 min-w-0 overflow-x-hidden">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

const getPageTitle = () => {
    const routeName = router.currentRoute.value.name
    switch (routeName) {
        case 'AdminDashboard':
            return 'Admin Panel'
        case 'AdminCenters':
            return 'O\'quv Markazlari'
        case 'AdminGroups':
            return 'Guruhlar'
        default:
            return 'Admin Panel'
    }
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>
