import { type CreateStudentPayload } from '@/services/student'
import { useStudentStore } from '@/stores/student'
import { onMounted, ref } from 'vue'

export function useStudents() {
  const studentStore = useStudentStore()
  const searchInput = ref('') 
  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingStudent = ref<any>(null)
  const studentToDelete = ref<any>(null)
  const loadingSubmit = ref(false)
  const submitError = ref('')
  const isFormValid = ref(false)

  const form = ref<CreateStudentPayload>({
    name: '',
    email: '',
    ra: '',
    cpf: '',
  })

  function handleFormUpdate(payload: { data: CreateStudentPayload, isValid: boolean }) {
    form.value = { ...payload.data }
    isFormValid.value = payload.isValid
  }

  function openCreateDialog() {
    editingStudent.value = null
    form.value = { name: '', email: '', ra: '', cpf: '' }
    submitError.value = ''
    isFormValid.value = false
    dialogOpen.value = true
  }

  function openEditDialog(student: any) {
    editingStudent.value = student
    form.value = { ...student }
    submitError.value = ''
    isFormValid.value = true 
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
    if (!isFormValid.value) return
    loadingSubmit.value = true
    submitError.value = ''
    try {
      if (editingStudent.value) {
        await studentStore.updateStudent(editingStudent.value.id, form.value)
      } else {
        await studentStore.createStudent(form.value)
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
      console.error(error)
    } finally {
      loadingSubmit.value = false
    }
  }

  const handleSearch = () => {
    studentStore.currentPage = 1
    studentStore.fetchStudents(1, searchInput.value)
  }

  const handlePageChange = (page: number) => {
    studentStore.currentPage = page
    studentStore.fetchStudents(page, searchInput.value)
  }

  const resetTable = () => {
    searchInput.value = ''
    studentStore.currentPage = 1
    studentStore.fetchStudents(1, '')
  }

  onMounted(() => studentStore.fetchStudents())

  return {
    studentStore, searchInput, resetTable, dialogOpen, deleteDialogOpen,
    editingStudent, studentToDelete, loadingSubmit, submitError, isFormValid,
    handleFormUpdate, openCreateDialog, openEditDialog, closeDialog,
    openDeleteDialog, handleSubmit, handleDelete, handleSearch, handlePageChange
  }
}