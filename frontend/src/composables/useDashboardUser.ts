import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

export function useDashboardUser() {
  const authStore = useAuthStore()

  const userName = computed(() => authStore.user?.name || '')
  const userEmail = computed(() => authStore.user?.email || '')
  const userRole = computed(() => authStore.user?.role || '')
  const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

  return {
    userName,
    userEmail,
    userRole,
    isAdmin,
  }
}