<template>
  <v-container fill-height fluid class="d-flex align-center justify-center login-container">
    <v-card class="login-card" elevation="8" width="100%" max-width="400">
      <v-card-item class="pt-8">
        <div class="text-center mb-4">
          <div class="d-flex justify-center mb-4">
            <v-img height="120" aspect-ratio="16/9" contain src="src/assets/logo-mais-a-educacao.svg"
              class="mx-auto mb-4" />
          </div>
        </div>
      </v-card-item>

      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field v-model="email" label="Email" type="email" prepend-inner-icon="mdi-email" variant="outlined"
            density="comfortable" class="mb-4" :error="!!errors.email"
            :error-messages="errors.email ? [errors.email] : []" @blur="handleEmailBlur" />

          <v-text-field v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined" density="comfortable" class="mb-2" :error="!!errors.password"
            :error-messages="errors.password ? [errors.password] : []" @blur="handlePasswordBlur"
            @click:append-inner="showPassword = !showPassword" autocomplete="password" />

          <v-btn block size="large" color="primary" type="submit" class="mb-4 text-none font-weight-bold"
            :loading="loading" :disabled="!isFormValid">
            Entrar
          </v-btn>

          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable
            @click:close="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>
        </v-form>

        <div class="text-center">
          <p class="text-subtitle2 mb-0">
            Não tem conta?
            <router-link to="/register" class="font-weight-bold text-primary">
              Registre-se aqui
            </router-link>
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { useUserLogin } from '@/composables/userLogin'
import { useUserValidation } from '@/composables/useUserValidation'
import { computed, ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const { errors, validateEmail, validatePassword, resetErrors } = useUserValidation()
const { login, loading, error: errorMessage } = useUserLogin()

const isFormValid = computed(() => {
  return email.value && password.value && !errors.email && !errors.password
})

// funções do formulário
function handleEmailBlur() {
  validateEmail(email.value)
}

function handlePasswordBlur() {
  validatePassword(password.value)
}

async function handleLogin() {
  resetErrors()
  validateEmail(email.value)
  validatePassword(password.value)

  if (!isFormValid.value) return

  await login({
    email: email.value,
    password: password.value,
  })
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f04e4e 0%, #0b87a9 100%);
  min-height: 100vh;
}

.login-card {
  border-radius: 16px;
  border: none;
}

:deep(a) {
  text-decoration: none;
}
</style>