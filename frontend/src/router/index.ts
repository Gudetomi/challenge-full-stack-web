
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { 
      layout: 'blank',      // Página simples, sem layout
      requiresAuth: false,  // Não precisa estar logado
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
      requiresAdmin: true, // Só admin acessa
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

router.beforeEach((to, from, next) => {
  
  next()
})

export default router