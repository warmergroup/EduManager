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
    console.log('Profile update:', form.value)
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
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profil</h1>
        <p class="mt-2 text-gray-600">Shaxsiy ma'lumotlaringiz va sozlamalar</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold text-white">
                  {{ user?.fullName?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ user?.fullName }}</h2>
                <p class="text-gray-600">{{ user?.email }}</p>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Student
                </span>
              </div>
            </div>

            <!-- Profile Form -->
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">To'liq ism</label>
                <input v-model="form.fullName" type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="form.email" type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Yangi parol (ixtiyoriy)</label>
                <input v-model="form.newPassword" type="password"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="O'zgartirmaslik uchun bo'sh qoldiring" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Joriy parol</label>
                <input v-model="form.currentPassword" type="password"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>

              <div class="flex justify-end">
                <button type="submit" :disabled="loading"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {{ loading ? 'Saqlanmoqda...' : 'Saqlash' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Statistikalar</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Ro'yxatdan o'tgan</span>
                <span class="font-medium">{{ formatDate(user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Jami vazifalar</span>
                <span class="font-medium">{{ stats.totalTasks || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Topshirilgan</span>
                <span class="font-medium">{{ stats.submittedTasks || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">O'rtacha ball</span>
                <span class="font-medium">{{ stats.averageScore || 0 }}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
