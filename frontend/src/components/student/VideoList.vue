<template>
  <div class="space-y-6">
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Video Lessons</h3>
        <button
          @click="fetchVideos"
          :disabled="loading"
          class="btn-secondary text-sm"
        >
          Refresh
        </button>
      </div>
      
      <Loading v-if="loading" text="Loading videos..." />
      
      <div v-else-if="videos.length === 0" class="text-center py-8">
        <VideoCameraIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No videos</h3>
        <p class="mt-1 text-sm text-gray-500">No video lessons available yet.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="video in videos"
          :key="video._id"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="aspect-video bg-gray-200 flex items-center justify-center">
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-400">
              <VideoCameraIcon class="w-12 h-12" />
            </div>
          </div>
          
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 text-sm mb-2">{{ video.title }}</h4>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ video.description }}</p>
            
            <div class="flex items-center justify-between">
              <span v-if="video.duration" class="text-xs text-gray-500">
                {{ formatDuration(video.duration) }}
              </span>
              <a
                :href="video.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary text-sm"
              >
                Watch
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Alert
        :show="!!error"
        type="error"
        title="Error"
        :message="error || ''"
        @close="error = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'
import { useVideosStore } from '../../stores/videos'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'

const videosStore = useVideosStore()
const { videos, loading, error } = videosStore

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const fetchVideos = async () => {
  await videosStore.fetchVideos()
}

onMounted(() => {
  fetchVideos()
})
</script>