import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import type { Video, VideoCreate } from '../types'

export const useVideosStore = defineStore('videos', () => {
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchVideos = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/videos')
      videos.value = response.data.data.videos || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch videos'
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
      const newVideo = response.data.data.video
      videos.value = [newVideo, ...videos.value]
      return newVideo
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add video'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    videos,
    loading,
    error,
    fetchVideos,
    addVideo
  }
})