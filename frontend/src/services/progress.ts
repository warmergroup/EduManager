import { api } from './api'

export const getProgress = async () => {
  const response = await api.get('/submissions/progress')
  return response.data.data.progress
}