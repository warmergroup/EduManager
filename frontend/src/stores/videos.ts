import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import type { Video, VideoCreate } from '../types'

export const useVideosStore = defineStore('videos', () => {
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number>(0)
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes cache

  // Computed properties for better performance
  const totalVideos = computed(() => videos.value.length)
  const hasVideos = computed(() => videos.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  const fetchVideos = async (forceRefresh = false) => {
    // Check if we have recent data and don't need to refresh
    const now = Date.now()
    if (!forceRefresh && hasVideos.value && (now - lastFetch.value) < cacheTimeout) {
      return videos.value
    }

    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/videos')
      
      if (response.data.success && response.data.data.videos) {
        videos.value = response.data.data.videos
        lastFetch.value = now
      } else {
        videos.value = []
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Video darslarni yuklashda xatolik yuz berdi'
      videos.value = []
    } finally {
      loading.value = false
    }
  }

  const addVideo = async (videoData: VideoCreate) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/videos', videoData)
      
      if (response.data.success && response.data.data.video) {
        const newVideo = response.data.data.video
        videos.value = [newVideo, ...videos.value]
        lastFetch.value = Date.now() // Update cache timestamp
        return newVideo
      } else {
        throw new Error('Video qo\'shishda xatolik yuz berdi')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Video qo\'shishda xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCache = () => {
    lastFetch.value = 0
    videos.value = []
  }

  const refreshVideos = () => {
    return fetchVideos(true)
  }

  return {
    videos,
    loading,
    error,
    totalVideos,
    hasVideos,
    isLoading,
    hasError,
    fetchVideos,
    addVideo,
    clearCache,
    refreshVideos
  }
})