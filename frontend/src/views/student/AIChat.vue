<script setup lang="ts">
import AIChat from '../../components/student/AIChat.vue'
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('aiChat.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('aiChat.description') }}</p>
    </div>
    <AIChat />
  </div>
</template>
