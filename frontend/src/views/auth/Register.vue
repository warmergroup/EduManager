<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to existing account
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="fullName" class="sr-only">Full Name</label>
            <input id="fullName" v-model="form.fullName" name="fullName" type="text" required class="input-field"
              placeholder="Full Name" />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" v-model="form.email" name="email" type="email" required class="input-field"
              placeholder="Email address" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="form.password" name="password" type="password" required minlength="6"
              class="input-field" placeholder="Password (min 6 characters)" />
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <select id="role" v-model="form.role" name="role" required class="input-field">
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="authStore.loading" class="btn-primary w-full">
            <span v-if="!authStore.loading">Create account</span>
            <Loading v-else text="Creating account..." />
          </button>
        </div>

        <Alert :show="!!authStore.error" type="error" :title="authStore.error || ''" @close="authStore.error = null" />
      </form>
    </div>
  </div>
</template>

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
    router.push(`/${user.role}/dashboard`)
  } catch (error) {
    // Error is handled in the store
  }
}
</script>