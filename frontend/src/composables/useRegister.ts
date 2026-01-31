import { userService } from '@/services/user'
import { useAuthStore } from '@/stores/auth'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useRegister() {
  const router = useRouter()
  const auth = useAuthStore()

  const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const showPassword = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')

  const errors = reactive<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const passwordStrength = computed(() => {
    let strength = 0
    if (form.password.length >= 8) strength += 25
    if (/[A-Z]/.test(form.password)) strength += 25
    if (/[0-9]/.test(form.password)) strength += 25
    if (/[^A-Za-z0-9]/.test(form.password)) strength += 25
    return strength
  })

  const passwordStrengthColor = computed(() => {
    if (passwordStrength.value < 50) return 'error'
    if (passwordStrength.value < 75) return 'warning'
    return 'success'
  })

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

  function validateName() {
    if (!form.name) errors.name = 'Nome é obrigatório'
    else if (form.name.length < 3)
      errors.name = 'Nome deve ter pelo menos 3 caracteres'
    else errors.name = ''
  }

  function validateEmail() {
    if (!form.email) errors.email = 'Email é obrigatório'
    else if (!form.email.includes('@'))
      errors.email = 'Email inválido'
    else errors.email = ''
  }

  function validatePassword() {
    if (!form.password) errors.password = 'Senha é obrigatória'
    else if (form.password.length < 6)
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
    else errors.password = ''
  }

  function validateConfirmPassword() {
    if (!form.confirmPassword)
      errors.confirmPassword = 'Confirmação é obrigatória'
    else if (form.confirmPassword !== form.password)
      errors.confirmPassword = 'As senhas não correspondem'
    else errors.confirmPassword = ''
  }

  async function handleRegister() {
    validateName()
    validateEmail()
    validatePassword()
    validateConfirmPassword()

    if (!isFormValid.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      await userService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      })

      const { data } = await userService.login({
        email: form.email,
        password: form.password,
      })

      auth.setAuth(data.token, data.user)
      await router.push('/dashboard')
    } catch (error: any) {
      errorMessage.value =
        error.response?.data?.message ||
        'Erro ao registrar. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  return {
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
  }
}
