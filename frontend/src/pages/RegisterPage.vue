<template>
  <v-container
    fill-height
    fluid
    class="d-flex align-center justify-center register-container"
  >
    <v-card class="register-card" elevation="8" width="100%" max-width="400">
      <v-card-item class="pt-8">
        <div class="text-center mb-4">
          <div class="d-flex justify-center mb-4">
            <v-img
            height="120"
            aspect-ratio="16/9"
            contain
            src="/src/assets/logo-mais-a-educacao.svg"
            class="mx-auto mb-4"
            />
        </div>
          <h1 class="text-h4 font-weight-bold mb-2">Criar Conta</h1>
          <p class="text-subtitle2 text-gray-600">
            Registre-se para começar
          </p>
        </div>
      </v-card-item>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          <v-text-field
            v-model="form.name"
            label="Nome completo"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :error="!!errors.name"
            :error-messages="errors.name ? [errors.name] : []"
            @blur="validateName"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :error="!!errors.email"
            :error-messages="errors.email ? [errors.email] : []"
            @blur="validateEmail"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            density="comfortable"
            class="mb-2"
            :error="!!errors.password"
            :error-messages="errors.password ? [errors.password] : []"
            @blur="validatePassword"
            @click:append-inner="showPassword = !showPassword"
            @input="updatePasswordStrength"
            required
          ></v-text-field>
          <v-progress-linear
            :model-value="passwordStrength"
            :color="passwordStrengthColor"
            class="mb-4"
            height="4"
          ></v-progress-linear>
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirmar senha"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :error="!!errors.confirmPassword"
            :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
            @blur="validateConfirmPassword"
            required
          ></v-text-field>
          <v-btn
            block
            size="large"
            color="secondary"
            type="submit"
            class="mb-4 text-none font-weight-bold"
            :loading="loading"
            :disabled="!isFormValid"
          >
            Registrar
          </v-btn>
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="errorMessage = ''"
          >
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
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * REACTIVE STATE
 */
const router = useRouter()

// Dados do formulário
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Estados
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const passwordStrengthValue = ref(0)

// Erros de validação
const errors = reactive<{
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}>({})

/**
 * COMPUTED PROPERTIES
 */
// Calcula força da senha de 0 a 100
const passwordStrength = computed(() => {
  let strength = 0
  
  if (form.password.length >= 8) strength += 25
  if (/[A-Z]/.test(form.password)) strength += 25      // Tem maiúscula
  if (/[0-9]/.test(form.password)) strength += 25      // Tem número
  if (/[^A-Za-z0-9]/.test(form.password)) strength += 25 // Tem caractere especial
  
  return strength
})

// Cor do indicador baseado na força
const passwordStrengthColor = computed(() => {
  if (passwordStrength.value < 50) return 'error'      // Vermelho
  if (passwordStrength.value < 75) return 'warning'    // Amarelo
  return 'success'                                       // Verde
})

// Verifica se formulário é válido
const isFormValid = computed(() => {
  return (
    form.name &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword
  )
})

/**
 * MÉTODOS DE VALIDAÇÃO
 */
function validateName() {
  if (!form.name) {
    errors.name = 'Nome é obrigatório'
  } else if (form.name.length < 3) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres'
  } else {
    errors.name = ''
  }
}

function validateEmail() {
  if (!form.email) {
    errors.email = 'Email é obrigatório'
  } else if (!form.email.includes('@')) {
    errors.email = 'Email inválido'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
  } else {
    errors.password = ''
  }
}

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'As senhas não correspondem'
  } else {
    errors.confirmPassword = ''
  }
}

// Atualiza força de senha conforme digita
function updatePasswordStrength() {
}

/**
 * MÉTODO DE SUBMIT
 */
async function handleRegister() {
  // Valida todos os campos
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    // TODO: Chamar API de registro aqui
    console.log('Registrando com:', form)
    
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  
    await router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao registrar'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #f04e4e 0%, #0b87a9 100%);
  min-height: 100vh;
}

.register-card {
  border-radius: 16px;
  border: none;
}
:deep(a) {
  text-decoration: none;
}
</style>