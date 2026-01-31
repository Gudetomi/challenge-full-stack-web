import { userService } from '@/services/user'
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    user: null as User | null,
    isRefreshing: false,
  }),

  actions: {
    setAuth(token: string, user?: User) {
      this.token = token
      if (user) this.user = user
      localStorage.setItem('token', token)
    },

    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    async refreshToken() {
      if (this.isRefreshing) return

      try {
        this.isRefreshing = true

        const { data } = await userService.refreshToken()

        this.setAuth(data.token)
        return data.token
      } catch (error) {
        this.clearAuth()
        throw error
      } finally {
        this.isRefreshing = false
      }
    },
  },
})
