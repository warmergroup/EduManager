<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'

const authStore = useAuthStore()
const progressStore = useProgressStore()

const user = computed(() => authStore.user)
const stats = computed(() => progressStore.progress)

const loading = ref(false)
const form = ref({
  fullName: '',
  email: '',
  currentPassword: '',
  newPassword: ''
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('uz-UZ')
}

const updateProfile = async () => {
  try {
    loading.value = true
    // TODO: Implement profile update API call
    // Show success message
  } catch (error) {
    console.error('Profile update error:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (user.value) {
    form.value.fullName = user.value.fullName
    form.value.email = user.value.email
  }

  // Load progress stats
  await progressStore.fetchProgress()
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">👤 Shaxsiy Profil</h1>
      <p class="mt-2 text-gray-600">Shaxsiy ma'lumotlaringiz va sozlamalarni boshqarish</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div class="flex items-center space-x-4 mb-6">
            <div
              class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-2xl font-bold text-white">
                {{ user?.fullName?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ user?.fullName }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                🎓 Talaba
              </span>
            </div>
          </div>

          <!-- Profile Form -->
          <form @submit.prevent="updateProfile" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">To'liq ism</label>
              <input v-model="form.fullName" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="To'liq ismingizni kiriting" required />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email manzil</label>
              <input v-model="form.email" type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Email manzilingizni kiriting" required />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Yangi parol (ixtiyoriy)</label>
              <input v-model="form.newPassword" type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="O'zgartirmaslik uchun bo'sh qoldiring" />
            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" :disabled="loading"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {{ loading ? '⏳ Yangilanmoqda...' : '💾 Ma\'lumotlarni saqlash' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Progress Stats Card -->
      <div class="space-y-6">
        <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📊 O'qish Progressi
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Topshirilgan vazifalar:</span>
              <span class="font-bold text-green-600">{{ stats?.submittedTasks || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Jami vazifalar:</span>
              <span class="font-bold text-blue-600">{{ stats?.totalTasks || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Baholangan vazifalar:</span>
              <span class="font-bold text-purple-600">{{ stats?.gradedTasks || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">O'rtacha ball:</span>
              <span class="font-bold text-orange-600">{{ stats?.averageScore || 0 }}/100</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Progress foizi:</span>
              <span class="font-bold text-indigo-600">{{ stats?.completionPercentage || 0 }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🕒 Hisob ma'lumotlari
          </h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p class="flex items-center">
              <span class="mr-2">📅</span>
              Ro'yxatdan o'tgan: {{ formatDate(user?.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
