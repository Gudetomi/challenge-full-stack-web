<template>
  <v-container fill-height fluid class="d-flex align-center justify-center register-container">
    <v-card class="register-card" elevation="8" width="100%" max-width="400">
      <v-card-item class="pt-8">
        <div class="text-center mb-4">
          <div class="d-flex justify-center mb-4">
            <v-img height="120" aspect-ratio="16/9" contain src="/src/assets/logo-mais-a-educacao.svg"
              class="mx-auto mb-4" />
          </div>
          <h1 class="text-h4 font-weight-bold mb-2">Criar Conta</h1>
          <p class="text-subtitle2 text-gray-600">
            Registre-se para começar
          </p>
        </div>
      </v-card-item>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          <v-text-field v-model="form.name" label="Nome completo" prepend-inner-icon="mdi-account" variant="outlined"
            density="comfortable" class="mb-4" :error="!!errors.name" :error-messages="errors.name ? [errors.name] : []"
            @blur="validateName" required ></v-text-field>
          <v-text-field v-model="form.email" label="Email" type="email" prepend-inner-icon="mdi-email"
            variant="outlined" density="comfortable" class="mb-4" :error="!!errors.email"
            :error-messages="errors.email ? [errors.email] : []" @blur="validateEmail" required autocomplete="username"></v-text-field>
          <v-text-field v-model="form.password" label="Senha" :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined" density="comfortable" class="mb-2" :error="!!errors.password"
            :error-messages="errors.password ? [errors.password] : []" @blur="validatePassword"
            @click:append-inner="showPassword = !showPassword" autocomplete="new-password" required></v-text-field>
          <v-progress-linear :model-value="passwordStrength" :color="passwordStrengthColor" class="mb-4"
            height="4"></v-progress-linear>
          <v-text-field v-model="form.confirmPassword" label="Confirmar senha"
            :type="showPassword ? 'text' : 'password'" prepend-inner-icon="mdi-lock-check" variant="outlined"
            density="comfortable" class="mb-4" :error="!!errors.confirmPassword"
            :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []" @blur="validateConfirmPassword"
            required autocomplete="password"></v-text-field>
          <v-btn block size="large" color="secondary" type="submit" class="mb-4 text-none font-weight-bold"
            :loading="loading" :disabled="!isFormValid">
            Registrar
          </v-btn>
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable
            @click:close="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>
        </v-form>
        <div class="text-center">
          <p class="text-subtitle2 mb-0">
            Já tem conta?
            <router-link to="/login" class="font-weight-bold text-secondary">
              Faça login
            </router-link>
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import '@/assets/styles/Register.scss';
import { useRegister } from "@/composables/useRegister";
const {
  form,
  showPassword,
  loading,
  errorMessage,
  errors,
  passwordStrength,
  passwordStrengthColor,
  isFormValid,
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  handleRegister,
} = useRegister()

</script>