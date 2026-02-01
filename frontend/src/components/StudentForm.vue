<template>
  <v-dialog :model-value="isOpen" @update:model-value="$emit('close')" width="600">
    <v-card class="pa-6">
      <v-card-title class="text-h6 font-weight-bold mb-4">
        {{ isEditMode ? 'Editar Aluno' : 'Novo Aluno' }}
      </v-card-title>

      <v-form @submit.prevent="handleSubmit" class="mt-4">
        <!-- Nome -->
        <v-text-field
          v-model="form.name"
          label="Nome"
          placeholder="Digite o nome completo"
          variant="outlined"
          :error="!!formErrors.name"
          :error-messages="formErrors.name ? [formErrors.name] : []"
          @blur="validateName"
          class="mb-4"
          required
        />

        <!-- Email -->
        <v-text-field
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="Digite o email"
          variant="outlined"
          :error="!!formErrors.email"
          :error-messages="formErrors.email ? [formErrors.email] : []"
          @blur="validateEmail"
          class="mb-4"
          required
        />

        <!-- RA -->
        <v-text-field
          v-model="form.ra"
          label="RA (Não editável)"
          placeholder="Digite o RA"
          variant="outlined"
          :error="!!formErrors.ra"
          :error-messages="formErrors.ra ? [formErrors.ra] : []"
          @blur="validateRA"
          class="mb-4"
          :disabled="isEditMode"
          required
        />

        <!-- CPF -->
        <v-text-field
          v-model="form.cpf"
          label="CPF (Não editável)"
          placeholder="Digite o CPF"
          variant="outlined"
          :error="!!formErrors.cpf"
          :error-messages="formErrors.cpf ? [formErrors.cpf] : []"
          @blur="validateCPF"
          class="mb-6"
          :disabled="isEditMode"
          required
        />

        <!-- Erro de submit -->
        <v-alert
          v-if="submitError"
          type="error"
          variant="tonal"
          class="mb-6"
        >
          {{ submitError }}
        </v-alert>

        <!-- Botões -->
        <div class="d-flex gap-3 justify-end">
          <v-btn
            color="default"
            variant="outlined"
            @click="handleCancel"
            :disabled="loadingSubmit"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="loadingSubmit"
            :disabled="!isFormValid() || loadingSubmit"
          >
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  getNameErrorMessage,
  getRAErrorMessage,
  isStudentFormValid,
  validateStudentForm,
} from '@/utils/validateStudent'
import { reactive, ref, watch } from 'vue'

interface StudentFormProps {
  isOpen?: boolean
  isEditMode?: boolean
  initialData?: {
    id?: string
    name: string
    email: string
    ra: string
    cpf: string
  }
  isLoading?: boolean
}

interface StudentFormEmits {
  (e: 'close'): void
  (e: 'submit', data: any): void
}

const props = withDefaults(defineProps<StudentFormProps>(), {
  isOpen: false,
  isEditMode: false,
  isLoading: false,
})

const emit = defineEmits<StudentFormEmits>()

const form = reactive({
  name: '',
  email: '',
  ra: '',
  cpf: '',
})

const formErrors = reactive({
  name: '',
  email: '',
  ra: '',
  cpf: '',
})

const loadingSubmit = ref(false)
const submitError = ref('')

/**
 * Valida se o formulário é válido
 */
function isFormValid() {
  return (
    form.name &&
    form.email &&
    form.ra &&
    form.cpf &&
    isStudentFormValid(formErrors)
  )
}

/**
 * Valida campo de nome usando utils
 */
function validateName() {
  formErrors.name = getNameErrorMessage(form.name)
}

/**
 * Valida campo de email usando utils
 */
function validateEmail() {
  const errors = validateStudentForm(form)
  formErrors.email = errors.email
}

/**
 * Valida campo de RA usando utils
 */
function validateRA() {
  formErrors.ra = getRAErrorMessage(form.ra)
}

/**
 * Valida campo de CPF usando utils
 */
function validateCPF() {
  const errors = validateStudentForm(form)
  formErrors.cpf = errors.cpf
}

/**
 * Limpa formulário
 */
function clearForm() {
  form.name = ''
  form.email = ''
  form.ra = ''
  form.cpf = ''
  formErrors.name = ''
  formErrors.email = ''
  formErrors.ra = ''
  formErrors.cpf = ''
  submitError.value = ''
  loadingSubmit.value = false
}

/**
 * Preenche formulário com dados iniciais
 */
function populateForm() {
  if (props.initialData) {
    form.name = props.initialData.name
    form.email = props.initialData.email
    form.ra = props.initialData.ra
    form.cpf = props.initialData.cpf
  }
}

/**
 * Cancela edição e fecha modal
 */
function handleCancel() {
  clearForm()
  emit('close')
}

/**
 * Envia formulário
 */
async function handleSubmit() {
  // Valida todos os campos usando utils centralizado
  const errors = validateStudentForm(form)
  Object.assign(formErrors, errors)

  // Se formulário é válido, emite evento
  if (isStudentFormValid(formErrors)) {
    loadingSubmit.value = true
    submitError.value = ''

    try {
      const payload = {
        ...(props.initialData?.id && { id: props.initialData.id }),
        name: form.name,
        email: form.email,
        ra: form.ra,
        cpf: form.cpf,
      }

      emit('submit', payload)
    } catch (error: any) {
      submitError.value = error.message || 'Erro ao processar formulário'
    } finally {
      loadingSubmit.value = false
    }
  }
}

/**
 * Watch para isOpen - popula formulário ao abrir
 */
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      populateForm()
    } else {
      clearForm()
    }
  },
)

/**
 * Watch para isLoading (feedback da requisição)
 */
watch(
  () => props.isLoading,
  (newValue) => {
    if (!newValue) {
      // Se terminou de carregar e não há erro, fecha modal
      if (!submitError.value) {
        clearForm()
        emit('close')
      }
      loadingSubmit.value = false
    }
  },
)
</script>

<style scoped>
.v-dialog {
  z-index: 1000;
}
</style>