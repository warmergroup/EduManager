<template>
  <div class="space-y-6">
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Video Management</h3>
        <button @click="openAddModal" class="btn-primary">
          Add New Video
        </button>
      </div>

      <Loading v-if="loading" text="Loading videos..." />

      <div v-else-if="videos.length === 0" class="text-center py-8">
        <VideoCameraIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No videos</h3>
        <p class="mt-1 text-sm text-gray-500">Add your first video lesson.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="video in videos" :key="video._id"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <VideoPlayer :url="video.url" />

          <div class="p-4">
            <h4 class="font-semibold text-gray-900 text-sm mb-2">{{ video.title }}</h4>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ video.description }}</p>

            <div class="flex items-center justify-between">
              <span v-if="video.duration" class="text-xs text-gray-500">
                {{ formatDuration(video.duration) }}
              </span>
              <div class="space-x-2">
                <a :href="video.url" target="_blank" rel="noopener noreferrer" class="btn-secondary text-sm">
                  Open in YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Video Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Video</h3>

        <form @submit.prevent="handleAddVideo">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="videoForm.title" type="text" required class="input-field" placeholder="Video title" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="videoForm.description" required rows="3" class="input-field"
                placeholder="Video description"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input v-model="videoForm.url" type="url" required class="input-field" placeholder="https://..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL (optional)
              </label>
              <input v-model="videoForm.thumbnail" type="url" class="input-field" placeholder="https://..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds, optional)
              </label>
              <input v-model.number="videoForm.duration" type="number" min="1" class="input-field"
                placeholder="Duration in seconds" />
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 mt-6">
            <button type="button" @click="closeAddModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="videoLoading" class="btn-primary">
              <span v-if="!videoLoading">Add Video</span>
              <Loading v-else text="Adding..." />
            </button>
          </div>
        </form>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Error" :message="error || ''" @close="error = null" />

    <Alert :show="success" type="success" title="Success" message="Video added successfully" @close="success = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'
import { useVideosStore } from '../../stores/videos'
import Loading from '../ui/Loading.vue'
import Alert from '../ui/Alert.vue'
import VideoPlayer from '../ui/VideoPlayer.vue'

const videosStore = useVideosStore()
const { videos, loading, error } = videosStore

const showAddModal = ref(false)
const videoLoading = ref(false)
const success = ref(false)

const videoForm = reactive({
  title: '',
  description: '',
  url: '',
  thumbnail: '',
  duration: undefined as number | undefined
})

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  resetForm()
}

const resetForm = () => {
  videoForm.title = ''
  videoForm.description = ''
  videoForm.url = ''
  videoForm.thumbnail = ''
  videoForm.duration = undefined
}

const handleAddVideo = async () => {
  videoLoading.value = true

  try {
    await videosStore.addVideo(videoForm)
    success.value = true
    closeAddModal()
  } catch (err) {
    // Error handled in store
  } finally {
    videoLoading.value = false
  }
}

onMounted(() => {
  videosStore.fetchVideos()
})
</script>