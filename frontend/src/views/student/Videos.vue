<script setup lang="ts">
import VideoList from '../../components/student/VideoList.vue'
</script>
<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('videos.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('videos.description') }}</p>
    </div>

    <VideoList />
  </div>
</template>
