import { studentService, type CreateStudentPayload, type Student, type UpdateStudentPayload } from '@/services/student'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalStudents = ref(0)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value)
  const totalPages = computed(() => Math.ceil(totalStudents.value / pageSize.value))

  async function fetchStudents(page?: number, search?: string) {
    loading.value = true
    error.value = null
  
    try {
      const response = await studentService.listStudents({
        page: page || currentPage.value,
        limit: pageSize.value,
        search: search || searchQuery.value,
      })
  
      const data = response.data.students
  
      if (Array.isArray(data)) {
        students.value = data
      } else {
        console.warn('Resposta inesperada:', response.data)
        students.value = []
      }
  
      totalStudents.value = response.data.total ?? students.value.length
      currentPage.value = page || currentPage.value
  
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar alunos'
      console.error('Erro ao carregar alunos:', error.value)
    } finally {
      loading.value = false
    }
  }
  

  async function createStudent(data: CreateStudentPayload) {
    loading.value = true
    error.value = null
    const authStore = useAuthStore()
    data.userId = authStore.user?.id || ''
    try {
      const response = await studentService.createStudent(data)
      const newStudent = response.data.data || response.data

      students.value.unshift(newStudent)
      totalStudents.value++
      return newStudent
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar aluno'
      console.error('Erro ao criar aluno:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStudent(id: string, data: UpdateStudentPayload) {
    loading.value = true
    error.value = null
    const authStore = useAuthStore()
    data.userId = authStore.user?.id || ''
    try {
      const response = await studentService.updateStudent(id, data)
      const updatedStudent = response.data.data || response.data

      const index = students.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        students.value[index] = updatedStudent
      }
      return updatedStudent
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar aluno'
      console.error('Erro ao atualizar aluno:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStudent(id: string) {
    loading.value = true
    error.value = null

    try {
      await studentService.deleteStudent(id)
      students.value = students.value.filter((s) => s.id !== id)
      totalStudents.value--

    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar aluno'
      console.error('Erro ao deletar aluno:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchStudents(query: string) {
    searchQuery.value = query
    currentPage.value = 1
    await fetchStudents(1, query)
  }

  async function goToPage(page: number) {
    currentPage.value = page
    await fetchStudents(page, searchQuery.value)
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    students.value = []
    loading.value = false
    error.value = null
    searchQuery.value = ''
    currentPage.value = 1
    totalStudents.value = 0
  }

  return {
    students,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    totalStudents,
    
    isLoading,
    hasError,
    errorMessage,
    totalPages,
  
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    goToPage,
    clearError,
    reset,
  }
})