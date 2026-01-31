import { api } from '@/services/api'
import { userService } from '@/services/user'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type LoginPayload = {
  email: string
  password: string
}

type User = {
  id: string
  name: string
  email: string
  role?: string
}

export function useUserLogin() {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()
  const router = useRouter()

  async function login(data: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await userService.login(data)
      const { token } = response.data
      localStorage.setItem('token', token)

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      await loadProfile()
      if (!user.value) {
        throw new Error('Falha ao carregar perfil do usuário')
      }
      authStore.setAuth(token, user.value)
      await new Promise(resolve => setTimeout(resolve, 100))
      await router.push({ name: 'Dashboard' })
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || 'Erro ao realizar login'
      console.error('Erro no login:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await userService.logout()
    } finally {
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
      user.value = null
      authStore.clearAuth()
      await router.push({ name: 'Login' })
    }
  }

  async function loadProfile() {
    try {
      const response = await userService.getProfile()
      const userData = response.data.user || response.data

      console.log('Response do getProfile:', response.data)
      console.log('User extraído:', userData)

      user.value = userData
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      logout()
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    loadProfile,
  }
}