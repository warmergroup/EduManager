import api from './api'
import type { Video, VideoCreate } from '../types'

interface VideoResponse {
  success: boolean
  message: string
  data: {
    video: Video
  }
}

interface VideosResponse {
  success: boolean
  message: string
  data: {
    videos: Video[]
    total: number
    page: number
    limit: number
  }
}

interface VideoStatsResponse {
  success: boolean
  message: string
  data: {
    stats: {
      totalVideos: number
      totalViews: number
      popularVideos: Array<{
        _id: string
        title: string
        views: number
      }>
    }
  }
}

export const videosService = {
  async getAll(page = 1, limit = 10, search?: string) {
    const response = await api.get<VideosResponse>('/api/videos', {
      params: { page, limit, search }
    })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<VideoResponse>(`/api/videos/${id}`)
    return response.data.data.video
  },

  async create(videoData: VideoCreate) {
    const response = await api.post<VideoResponse>('/api/videos', videoData)
    return response.data.data.video
  },

  async update(id: string, videoData: Partial<VideoCreate>) {
    const response = await api.put<VideoResponse>(`/api/videos/${id}`, videoData)
    return response.data.data.video
  },

  async delete(id: string) {
    await api.delete(`/api/videos/${id}`)
  },

  async getMyVideos(page = 1, limit = 10) {
    const response = await api.get<VideosResponse>('/api/videos/teacher/my-videos', {
      params: { page, limit }
    })
    return response.data.data
  },

  async getStats() {
    const response = await api.get<VideoStatsResponse>('/api/videos/stats')
    return response.data.data.stats
  }
}
