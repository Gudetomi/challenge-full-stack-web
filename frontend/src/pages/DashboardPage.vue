<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-8">
          Bem-vindo! 👋
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <!-- Card 1: Total de Alunos -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="dashboard-card">
          <v-card-item>
            <!-- Avatar com ícone -->
            <template #prepend>
              <v-avatar color="primary" size="48">
                <v-icon icon="mdi-account-multiple"></v-icon>
              </v-avatar>
            </template>

            <!-- Título do card -->
            <v-card-title>Alunos Totais</v-card-title>
            
            <!-- Valor grande -->
            <v-card-subtitle class="text-h5 font-weight-bold text-primary">
              {{ totalStudents }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Card 2: Status Online -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="dashboard-card">
          <v-card-item>
            <template #prepend>
              <v-avatar color="success" size="48">
                <v-icon icon="mdi-check-circle"></v-icon>
              </v-avatar>
            </template>

            <v-card-title>Status</v-card-title>
            <v-card-subtitle class="text-h6 font-weight-bold text-success">
              Online
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Card 3: Seu Email -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="dashboard-card">
          <v-card-item>
            <template #prepend>
              <v-avatar color="info" size="48">
                <v-icon icon="mdi-email"></v-icon>
              </v-avatar>
            </template>

            <v-card-title>Email</v-card-title>
            <v-card-subtitle class="text-body2 text-truncate">
              seu.email@example.com
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Card 4: Seu Papel -->
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="dashboard-card">
          <v-card-item>
            <template #prepend>
              <v-avatar color="secondary" size="48">
                <v-icon icon="mdi-shield-account"></v-icon>
              </v-avatar>
            </template>

            <v-card-title>Seu Papel</v-card-title>
            <v-card-subtitle class="text-h6 font-weight-bold text-secondary">
              {{ userRole }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isAdmin" class="mt-6">
      <v-col cols="12">
        <v-card elevation="2" class="action-card">
          <v-card-item>
            <v-card-title class="d-flex align-center gap-3">
              <v-icon icon="mdi-account-plus"></v-icon>
              Ações de Administrador
            </v-card-title>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-text class="py-6">
            <v-btn
              color="primary"
              prepend-icon="mdi-account-multiple"
              to="/students"
              size="large"
              class="text-none"
            >
              Gerenciar Alunos
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * DADOS DO DASHBOARD
 */
// Dados simulados (depois virão da API)
const userName = ref('João Silva')
const userEmail = ref('joao@example.com')
const userRole = ref('Administrador')
const totalStudents = ref(42)
const isAdmin = ref(true) // Simulado, depois virá do authStore

/**
 * COMPUTED PROPERTIES
 */
// Pode adicionar lógica aqui se necessário
const greeting = computed(() => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}
.action-card {
  background: linear-gradient(135deg, rgba(51, 102, 204, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(51, 102, 204, 0.1);
}
.gap-3 {
  gap: 12px;
}
</style>