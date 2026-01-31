import { reactive } from 'vue'

export function useUserValidation() {
  const errors = reactive<{
    email?: string
    password?: string
  }>({})

  function validateEmail(email: string) {
    if (!email) return 'Email é obrigatório'
    if (!email.includes('@')) return 'Email inválido'
    return ''
  }

  function validatePassword(password: string) {
    if (!password) return 'Senha é obrigatória'
    if (password.length < 6) return 'Senha muito curta'
    return ''
  }

  function resetErrors() {
    errors.email = undefined
    errors.password = undefined
  }

  return {
    errors,
    validateEmail,
    validatePassword,
    resetErrors,
  }
}
