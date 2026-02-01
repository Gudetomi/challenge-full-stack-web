import { reactive } from 'vue'

export function useUserValidation() {
  const errors = reactive<{
    email?: string
    password?: string
  }>({})

  function validateEmail(email: string) {
    if (!email) {
      errors.email = 'Email é obrigatório'
    } else if (!email.includes('@')) {
      errors.email = 'Email inválido'
    } else {
      errors.email = ''
    }
  }

  function validatePassword(password: string) {
    if (!password) {
      errors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      errors.password = 'Senha muito curta'
    } else {
      errors.password = ''
    }
  }

  function resetErrors() {
    errors.email = ''
    errors.password = ''
  }

  return {
    errors,
    validateEmail,
    validatePassword,
    resetErrors,
  }
}
