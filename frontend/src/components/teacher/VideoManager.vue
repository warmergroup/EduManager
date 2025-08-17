<template>
  <div class="space-y-6">
    <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">🎥 Video Darslar</h3>
        <button @click="openAddModal"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          ➕ Yangi Video Qo'shish
        </button>
      </div>

      <Loading v-if="loading" text="Video darslar yuklanmoqda..." />

      <div v-else-if="videos.length === 0" class="text-center py-12">
        <VideoCameraIcon class="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hali video darslar mavjud emas</h3>
        <p class="text-gray-500">Birinchi video darsingizni qo'shing</p>
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
                  🎬 YouTube'da ochish
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Video Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">➕ Yangi Video Qo'shish</h3>

        <form @submit.prevent="handleAddVideo">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">📝 Video nomi</label>
              <input v-model="videoForm.title" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Video dars nomi" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">📖 Tavsif</label>
              <textarea v-model="videoForm.description" required rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Video dars haqida qisqacha ma'lumot"></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">🔗 Video havolasi</label>
              <input v-model="videoForm.url" type="url" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                🖼️ Rasim havolasi (ixtiyoriy)
              </label>
              <input v-model="videoForm.thumbnail" type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..." />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                ⏱️ Davomiyligi (soniyada, ixtiyoriy)
              </label>
              <input v-model.number="videoForm.duration" type="number" min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Davomiyligi soniyada" />
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button type="button" @click="closeAddModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Bekor qilish
            </button>
            <button type="submit" :disabled="videoLoading"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200">
              {{ videoLoading ? '⏳ Qo\'shilmoqda...' : 'Video qo\'shish' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <Alert :show="!!error" type="error" title="Xatolik" :message="error || ''" @close="error = null" />

    <Alert :show="success" type="success" title="Muvaffaqiyatli" message="Video dars muvaffaqiyatli qo'shildi"
      @close="success = false" />
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