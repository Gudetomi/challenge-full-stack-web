<template>
  <v-app>
    <!-- NAVBAR (Barra superior) -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="4"
      class="navbar-gradient"
    >
      <!-- Botão de menu (abre/fecha sidebar) -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- Título do app -->
      <v-app-bar-title class="text-h6 font-weight-bold">
        Alunos Manager
      </v-app-bar-title>

      <!-- Espaço vazio (empurra próximos itens para direita) -->
      <v-spacer></v-spacer>

      <!-- Menu do usuário (dropdown) -->
      <v-menu offset-y>
        <!-- Ativador do menu (botão com avatar) -->
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            class="mr-2"
          >
            <!-- Avatar com iniciais do usuário -->
            <v-avatar size="36" color="secondary">
              <span class="text-white text-h6">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <!-- Itens do menu dropdown -->
        <v-list>
          <!-- Exibir email do usuário -->
          <v-list-item
            prepend-icon="mdi-account"
            title="Perfil"
            disabled
          >
            <template #subtitle>
              {{ userEmail }}
            </template>
          </v-list-item>

          <!-- Separador -->
          <v-divider></v-divider>

          <!-- Botão de logout -->
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- SIDEBAR (Barra lateral) -->
    <!-- 🔑 IMPORTANTE: drawer começa TRUE para aparecer por padrão -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="sidebar-drawer"
      permanent
    >
      <!-- Logo/Título do app no sidebar -->
      <v-list-item
        title="Alunos Manager"
        subtitle="v1.0.0"
        class="mb-4"
      ></v-list-item>

      <v-divider></v-divider>

      <!-- Menu do sidebar -->
      <v-list dense>
        <!-- Item: Dashboard -->
        <v-list-item
          :to="{ name: 'Dashboard' }"
          prepend-icon="mdi-home"
          title="Dashboard"
          @click="drawer = false"
        ></v-list-item>

        <!-- Item: Alunos (só aparece se for admin) -->
        <v-list-item
          v-if="isAdmin"
          :to="{ name: 'Students' }"
          prepend-icon="mdi-account-multiple"
          title="Alunos"
          @click="drawer = false"
        ></v-list-item>
      </v-list>

      <!-- Espaço vazio (empurra próximos itens para baixo) -->
      <v-spacer></v-spacer>

      <!-- Informações do usuário no final do sidebar -->
      <v-divider></v-divider>

      <v-list-item
        class="mt-4"
        prepend-icon="mdi-information"
        title="Sobre"
        subtitle="Sistema de Gerenciamento de Alunos"
      ></v-list-item>
    </v-navigation-drawer>

    <!-- MAIN (Conteúdo principal) -->
    <v-main class="main-content">
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * ESTADO DO LAYOUT
 */
const router = useRouter()
const authStore = useAuthStore()

// 🔑 IMPORTANTE: drawer começa TRUE (menu lateral ativo por padrão)
const drawer = ref(true)

/**
 * COMPUTED PROPERTIES - usando dados do Pinia store
 */
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

/**
 * Verifica se usuário é admin
 */
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

/**
 * Método de logout
 */
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