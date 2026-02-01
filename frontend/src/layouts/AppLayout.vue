<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      elevation="4"
      class="navbar-gradient"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-h6 font-weight-bold">
        Challenge FullStack Web
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            class="mr-2"
          >
            <v-avatar size="36" color="secondary">
              <span class="text-white text-h6">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            title="Perfil"
            disabled
          >
            <template #subtitle>
              {{ userEmail }}
            </template>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="sidebar-drawer"
      permanent
    >
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          :to="{ name: 'Dashboard' }"
          prepend-icon="mdi-home"
          title="Dashboard"
        ></v-list-item>
        <!-- only admin -->
        <v-list-item
          v-if="isAdmin"
          :to="{ name: 'Students' }"
          prepend-icon="mdi-account-multiple"
          title="Alunos"
        ></v-list-item>
      </v-list>
      <v-spacer></v-spacer>
    </v-navigation-drawer>
    <v-main class="main-content">
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const userEmail = computed(() => authStore.user?.email || '')
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

async function handleLogout() {
  authStore.clearAuth()
  await router.push({ name: 'Login' })
}
</script>

<style scoped>
.navbar-gradient {
  background: linear-gradient(135deg, #3366cc 0%, #7c3aed 100%);
}

.sidebar-drawer {
  background: #f5f5f5;
}

.main-content {
  background: #f5f5f5;
}

:deep(.v-app-bar) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>