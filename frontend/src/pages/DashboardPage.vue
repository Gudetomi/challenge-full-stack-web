<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-8">
          Bem-vindo! {{ userName }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="dashboard-card">
          <v-card-item>
            <template #prepend>
              <v-avatar color="info" size="48">
                <v-icon icon="mdi-email"></v-icon>
              </v-avatar>
            </template>

            <v-card-title>Email</v-card-title>
            <v-card-subtitle class="text-h6 font-weight-bold text-primary">
              {{ userEmail }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
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
import '@/assets/styles/Dashboard.scss';
import { useDashboardUser } from '@/composables/useDashboardUser';
const { userName, userEmail, userRole, isAdmin } = useDashboardUser()
</script>