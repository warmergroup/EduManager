<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useVideosStore } from '@/stores/videos'
import VideoPlayer from '../ui/VideoPlayer.vue'
import Loading from '../ui/Loading.vue'

const videosStore = useVideosStore()
const { videos, loading } = storeToRefs(videosStore)

onMounted(async () => {
  if (videos.value.length === 0) {
    await videosStore.fetchVideos()
  }
})

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div class="space-y-6">
    <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">🎥 {{ $t('videos.title') }}</h3>
        <div class="text-sm text-gray-500">
          {{ $t('videos.totalVideos') }}: {{ videos.length }}
        </div>
      </div>

      <Loading v-if="loading" :text="$t('videos.loading')" />

      <div v-else-if="videos.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
          </path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('videos.noVideos') }}</h3>
        <p class="text-gray-500">{{ $t('videos.noVideosDesc') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="video in videos" :key="video._id"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <VideoPlayer :url="video.url" />

          <div class="p-4">
            <h4 class="font-semibold text-gray-900 text-sm mb-2">{{ video.title }}</h4>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ video.description }}</p>

            <div class="flex items-center justify-between">
              <span v-if="video.duration" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                ⏱️ {{ formatDuration(video.duration) }}
              </span>
              <div class="space-x-2">
                <a :href="video.url" target="_blank" rel="noopener noreferrer"
                  class="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors">
                  🎬 {{ $t('videos.openYouTube') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>