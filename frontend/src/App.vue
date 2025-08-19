<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Toast from './components/ui/Toast.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Try to fetch current user if token exists
  if (authStore.token) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error) {
      // Token is invalid, logout
      authStore.logout()
    }
  }
})
</script>
<template>
  <div class="container mx-auto bg-red-500">
    <router-view />
    <Toast />
  </div>
</template>
