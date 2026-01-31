<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card class="text-center pa-8" elevation="0">
      <v-icon size="120" color="primary" class="mb-6">
        mdi-alert-circle
      </v-icon>
      <h1 class="text-h3 font-weight-bold mb-4">404</h1>
      <p class="text-h6 mb-6 text-gray-600">
        Página não encontrada
      </p>
      <router-link to="/">
        <v-btn color="primary" size="large" class="text-none">
          Voltar para Home
        </v-btn>
      </router-link>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
:deep(a) {
  text-decoration: none;
}
</style>