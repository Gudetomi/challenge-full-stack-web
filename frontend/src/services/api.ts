import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const newToken = await auth.refreshToken()

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)
      } catch {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
