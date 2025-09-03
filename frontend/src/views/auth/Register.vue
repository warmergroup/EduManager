<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Loading from '../../components/ui/Loading.vue'
import Alert from '../../components/ui/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  role: '' as 'student' | 'teacher' | ''
})

const handleRegister = async () => {
  try {
    const user = await authStore.register(form as any)

    // Role'ga qarab redirect qilish
    if (user.role === 'student') {
      router.push('/student/dashboard')
    } else if (user.role === 'teacher') {
      router.push('/teacher/dashboard')
    } else {
      // Agar role aniqlanmagan bo'lsa, home'ga qaytarish
      router.push('/')
    }
  } catch (error) {
    // Error is handled in the store
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Card Container -->
      <div class="bg-white flex flex-col gap-4 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <!-- Header -->
        <div class="text-center">
          <div
            class="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ $t('auth.register.title') }}
          </h2>
          <p class="text-gray-600">
            {{ $t('auth.register.subtitle') }}
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- Full Name Field -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.fullName') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input id="fullName" v-model="form.fullName" name="fullName" type="text" required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                :placeholder="$t('auth.register.fullName')" />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.email') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207">
                  </path>
                </svg>
              </div>
              <input id="email" v-model="form.email" name="email" type="email" required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                :placeholder="$t('auth.register.email')" />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.password') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                  </path>
                </svg>
              </div>
              <input id="password" v-model="form.password" name="password" type="password" required minlength="6"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                :placeholder="$t('auth.register.password')" />
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ $t('auth.register.passwordHint') }}</p>
          </div>

          <!-- Role Field -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.role') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                  </path>
                </svg>
              </div>
              <select id="role" v-model="form.role" name="role" required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 appearance-none bg-white">
                <option value="">{{ $t('auth.register.role') }}</option>
                <option value="student">🎓 Talaba</option>
                <option value="teacher">👨‍🏫 O'qituvchi</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="authStore.loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]">
              <span v-if="!authStore.loading" class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
                  {{ $t('auth.register.registerButton') }}
              </span>
              <Loading v-else text="{{ $t('auth.register.registerButton') }}..." />
            </button>
          </div>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">{{ $t('auth.register.or') }}</span>
            </div>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <router-link to="/login"
              class="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
              {{ $t('auth.register.signIn') }}
            </router-link>
          </div>
        </form>

        <!-- Error Alert -->
        <Alert :show="!!authStore.error" type="error" :title="authStore.error || ''" @close="authStore.error = null" />
      </div>

      <!-- Back to Home Link -->
      <div class="text-center mt-6">
        <router-link to="/"
          class="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
            </path>
          </svg>
          {{ $t('auth.register.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>