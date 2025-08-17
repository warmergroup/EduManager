<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">🤖 AI Yordamchisi</h1>
      <p class="mt-2 text-gray-600">O'qish bo'yicha savollaringizga sun'iy intellekt yordamida javob oling</p>
    </div>
    <AIChat />
  </div>
</template>

<script setup lang="ts">
import AIChat from '../../components/student/AIChat.vue'
</script>