import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
    },
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/pages/StudentsPage.vue'),
    meta: {
      layout: 'app',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      layout: 'blank',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!to.meta.requiresAuth) {
    return true
  }
  if (!auth.token) {
    return { name: 'Login' }
  }
  if (!auth.user) {
    try {
      await auth.loadUser()
    } catch {
      auth.clearAuth()
      return { name: 'Login' }
    }
  }
  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && auth.user && !allowedRoles.includes(auth.user.role!)) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router
