import { type CreateStudentPayload } from '@/services/student'
import { useStudentStore } from '@/stores/student'
import { computed, onMounted, reactive, ref } from 'vue'

export function useStudents() {
  const studentStore = useStudentStore()
  const searchInput = ref('') 
  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingStudent = ref<any>(null)
  const studentToDelete = ref<any>(null)
  const loadingSubmit = ref(false)
  const submitError = ref('')

  const form = reactive<CreateStudentPayload>({
    name: '',
    email: '',
    ra: '',
    cpf: '',
  })

  const formErrors = reactive<{
    name?: string
    email?: string
    ra?: string
    cpf?: string
  }>({})

  const isFormValid = computed(() => {
    return (
      form.name &&
      form.email &&
      form.ra &&
      form.cpf &&
      !formErrors.name &&
      !formErrors.email &&
      !formErrors.ra &&
      !formErrors.cpf
    )
  })

  function validateName() {
    if (!form.name) {
      formErrors.name = 'Nome é obrigatório'
    } else if (form.name.length < 3) {
      formErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    } else {
      formErrors.name = ''
    }
  }
  function resetTable() {
    searchInput.value = ''              // limpa o input de busca
    studentStore.currentPage = 1        // volta para a primeira página
    studentStore.fetchStudents(1, '')   // busca sem filtro
  }
  
  function validateEmail() {
    if (!form.email) {
      formErrors.email = 'Email é obrigatório'
    } else if (!form.email.includes('@')) {
      formErrors.email = 'Email inválido'
    } else {
      formErrors.email = ''
    }
  }

  function validateRA() {
    if (!form.ra) {
      formErrors.ra = 'RA é obrigatório'
    } else if (form.ra.length < 3) {
      formErrors.ra = 'RA deve ter pelo menos 3 caracteres'
    } else {
      formErrors.ra = ''
    }
  }

  function validateCPF() {
    if (!form.cpf) {
      formErrors.cpf = 'CPF é obrigatório'
    } else if (form.cpf.length < 11) {
      formErrors.cpf = 'CPF inválido'
    } else {
      formErrors.cpf = ''
    }
  }

  function validateForm() {
    validateName()
    validateEmail()
    validateRA()
    validateCPF()
  }

  function openCreateDialog() {
    editingStudent.value = null
    form.name = ''
    form.email = ''
    form.ra = ''
    form.cpf = ''
    submitError.value = ''
    Object.keys(formErrors).forEach((key) => {
      formErrors[key as keyof typeof formErrors] = ''
    })
    dialogOpen.value = true
  }

  function openEditDialog(student: any) {
    editingStudent.value = student
    form.name = student.name
    form.email = student.email
    form.ra = student.ra
    form.cpf = student.cpf
    submitError.value = ''
    Object.keys(formErrors).forEach((key) => {
      formErrors[key as keyof typeof formErrors] = ''
    })
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingStudent.value = null
  }

  function openDeleteDialog(student: any) {
    studentToDelete.value = student
    deleteDialogOpen.value = true
  }

  async function handleSubmit() {
    validateForm()
  
    if (!isFormValid.value) return
  
    loadingSubmit.value = true
    submitError.value = ''
  
    try {
      if (editingStudent.value) {
        await studentStore.updateStudent(editingStudent.value.id, { ...form })
      } else {
        await studentStore.createStudent({ ...form })
      }
      closeDialog()
      await studentStore.fetchStudents(studentStore.currentPage)
    } catch (error: any) {
      submitError.value = error.message || 'Erro ao salvar aluno'
    } finally {
      loadingSubmit.value = false
    }
  }
  async function handleDelete() {
    if (!studentToDelete.value) return
    loadingSubmit.value = true
    try {
      await studentStore.deleteStudent(studentToDelete.value.id)
      deleteDialogOpen.value = false
      await studentStore.fetchStudents(studentStore.currentPage)
    } catch (error: any) {
      console.error('Erro ao deletar:', error)
    } finally {
      loadingSubmit.value = false
    }
  }
  function handleSearch() {
    studentStore.currentPage = 1
    studentStore.fetchStudents(1, searchInput.value)
  }
  function handlePageChange(page: number) {
    studentStore.currentPage = page
    studentStore.fetchStudents(page, searchInput.value)
  }
  

  onMounted(async () => {
    await studentStore.fetchStudents()
  })

  return {
    studentStore,
    searchInput,
    resetTable,
    dialogOpen,
    deleteDialogOpen,
    editingStudent,
    studentToDelete,
    loadingSubmit,
    submitError,
    form,
    formErrors,
    isFormValid,
    validateName,
    validateEmail,
    validateRA,
    validateCPF,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    openDeleteDialog,
    handleSubmit,
    handleDelete,
    handleSearch,
    handlePageChange,
  }
}