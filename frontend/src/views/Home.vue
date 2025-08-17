<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Fixed Navbar -->
        <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <a href="#" class="text-xl sm:text-2xl font-bold text-blue-600">🎓 EduManager</a>
                        </div>
                    </div>

                    <!-- Desktop Navigation Links -->
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <a href="#features"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Xususiyatlar
                            </a>
                            <a href="#about"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Haqida
                            </a>
                            <a href="#contact"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Aloqa
                            </a>
                        </div>
                    </div>

                    <!-- Desktop Auth Buttons -->
                    <div class="hidden md:flex items-center space-x-4">
                        <router-link to="/login"
                            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Kirish
                        </router-link>
                        <router-link to="/register"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Ro'yxatdan o'tish
                        </router-link>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="md:hidden">
                        <button type="button" @click="toggleMobileMenu"
                            class="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile menu -->
                <div v-show="isMobileMenuOpen" class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        <a href="#features"
                            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                            Xususiyatlar
                        </a>
                        <a href="#about"
                            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                            Haqida
                        </a>
                        <a href="#contact"
                            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                            Aloqa
                        </a>
                        <div class="pt-4 pb-3 border-t border-gray-200">
                            <router-link to="/login"
                                class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                                Kirish
                            </router-link>
                            <router-link to="/register"
                                class="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors mt-2">
                                Ro'yxatdan o'tish
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="relative overflow-hidden pt-20 pb-10 h-[100vh] flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="relative z-10">
                    <main class="text-center lg:text-left">
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-20">
                            <h1
                                class="w-full md:w-1/2 text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight font-extrabold text-gray-900 leading-tight">
                                <span class="block text-blue-600">Edu Manager</span>
                                <span class="block">Zamonaviy</span>
                                <span class="block text-blue-600">Ta'lim</span>
                                <span class="block">Platformasi</span>
                            </h1>

                            <div class="w-full md:w-1/2 flex flex-col items-center gap-4">
                                <p
                                    class="text-base text-center font-semibold sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    O'qituvchilar va talabalar uchun yaratilgan zamonaviy platforma.
                                    <br> <span class="text-blue-600">Vazifalar, video darslar va AI yordamchisi bilan
                                        ta'lim jarayonini yaxshilang.</span>
                                </p>

                                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                                    <router-link to="/register"
                                        class="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        <span class="mr-2">🚀</span>
                                        Boshlash
                                    </router-link>

                                    <router-link to="/login"
                                        class="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-base sm:text-lg font-medium rounded-lg text-blue-600 bg-transparent hover:bg-blue-50 transition-all duration-200 transform hover:scale-105">
                                        <span class="mr-2">👁️</span>
                                        Demo ko'rish
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <!-- Background decoration for larger screens -->
            <div class="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10">
                <div class="w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            </div>
        </div>

        <!-- Features Section -->
        <div id="features" class="py-20 h-[100vh] md:h-auto lg:h-[100vh] sm:py-20 lg:py-24 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center my-12 lg:mb-20">
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                        Platforma Xususiyatlari
                    </h2>
                    <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        EduManager sizning ta'lim jarayoningizni qanday yaxshilaydi
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    <!-- Feature 1 -->
                    <div
                        class="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-2">
                        <div
                            class="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-blue-500 text-white mb-4 sm:mb-6">
                            <svg class="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                            Vazifalar Boshqaruvi</h3>
                        <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">O'quvchilar
                            vazifalarni bajaradi, o'qituvchilar ularni
                            bajaradi va baholaydi.</p>
                    </div>

                    <!-- Feature 2 -->
                    <div
                        class="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-2">
                        <div
                            class="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-green-500 text-white mb-4 sm:mb-6">
                            <svg class="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Video
                            Darslar</h3>
                        <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">YouTube video
                            darslarini platformada ko'rish va
                            o'rganish.</p>
                    </div>

                    <!-- Feature 3 -->
                    <div
                        class="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                        <div
                            class="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-purple-500 text-white mb-4 sm:mb-6">
                            <svg class="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">AI
                            Yordamchisi</h3>
                        <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">OpenAI yordamida
                            savollarga javob berish va vazifalar
                            yaratish.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- About Section -->
        <div id="about" class="pt-20 lg:h-[100vh] sm:py-20 lg:py-24 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center my-12 lg:mb-20">
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                        EduManager Haqida
                    </h2>
                    <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        EduManager - bu zamonaviy ta'lim platformasi bo'lib, o'qituvchilar va talabalar
                        o'rtasidagi o'zaro aloqani yaxshilash uchun yaratilgan.
                        Platforma Vue 3, Node.js va MongoDB texnologiyalari asosida qurilgan.
                    </p>
                </div>

                <!-- Stats Section -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

                    <!-- Total Lessons -->
                    <div
                        class="w-full aspect-video bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 md:h-8 md:w-8 text-blue-200" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                                    </path>
                                </svg>
                            </div>
                            <div class="ml-3 md:ml-4">
                                <p class="text-lg md:text-3xl  font-medium text-blue-200">Jami Darslar</p>
                                <p class="text-lg md:text-2xl lg:text-3xl font-bold text-white">{{
                                    stats.totalLessons || 0 }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Teachers -->
                    <div
                        class="w-full aspect-video bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 md:h-8 md:w-8 text-green-200" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                    </path>
                                </svg>
                            </div>
                            <div class="ml-3 md:ml-4">
                                <p class="text-lg md:text-3xl font-medium text-green-200">O'qituvchilar</p>
                                <p class="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{{
                                    stats.totalTeachers || 0 }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Students -->
                    <div
                        class="w-full aspect-video bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 md:h-8 md:w-8 text-purple-200" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                                    </path>
                                </svg>
                            </div>
                            <div class="ml-3 md:ml-4">
                                <p class="text-lg md:text-2xl font-medium text-purple-200">Talabalar</p>
                                <p class="text-lg md:text-2xl lg:text-3xl font-bold text-white">{{
                                    stats.totalStudents || 0 }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Videos -->
                    <div
                        class="w-full aspect-video bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 md:h-8 md:w-8 text-red-200" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                            <div class="ml-3 md:ml-4">
                                <p class="text-lg md:text-2xl font-medium text-red-200">Video Darslar</p>
                                <p class="text-lg md:text-2xl lg:text-3xl font-bold text-white">{{ stats.totalVideos
                                    || 0 }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Section -->
        <div id="contact" class="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                        Aloqa
                    </h2>
                    <p class="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12">
                        Savollaringiz bormi? Biz bilan bog'laning
                    </p>
                    <div class="flex justify-center">
                        <a href="mailto:info@edumanager.com"
                            class="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <span class="mr-2">✉️</span>
                            Email yozish
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800">
            <div class="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">🎓 EduManager</h3>
                    <p class="text-sm sm:text-base lg:text-lg text-gray-400 mb-8">Zamonaviy ta'lim platformasi</p>
                    <div class="mt-8">
                        <p class="text-xs sm:text-sm lg:text-base text-gray-400">&copy; 2024 EduManager. Barcha
                            huquqlar himoyalangan.</p>
                    </div>
                </div>
            </div>
        </footer>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Stats data
const stats = ref({
    totalLessons: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalVideos: 0
})

// Mock stats for now (later will be fetched from backend)
onMounted(() => {
    stats.value = {
        totalLessons: 25,
        totalTeachers: 8,
        totalStudents: 150,
        totalVideos: 45
    }
})

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Function to toggle mobile menu
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Function to close mobile menu
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}

// Close mobile menu on scroll
onMounted(() => {
    const handleScroll = () => {
        if (isMobileMenuOpen.value) {
            closeMobileMenu()
        }
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup
    return () => {
        window.removeEventListener('scroll', handleScroll)
    }
})
</script>
