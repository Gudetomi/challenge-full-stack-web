import { api } from '@/services/api'

export interface Student {
  id: string
  name: string
  email: string
  ra: string
  cpf: string
  createdAt: string
  updatedAt: string
  userId : string
}

export interface CreateStudentPayload {
  name: string
  email: string
  ra: string
  cpf: string
}

export interface UpdateStudentPayload {
  name?: string
  email?: string
  ra?: string
  cpf?: string
}

export interface StudentResponse {
  students: Student[]
  total?: number
  page?: number
  limit?: number
}

class StudentService {
  private baseUrl = '/students'
  async listStudents(params?: {
    page?: number
    limit?: number
    query?: string
  }) {
    try {
      const response = await api.get<StudentResponse>(this.baseUrl, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          query: params?.query || '',
        },
      })
      return response
    } catch (error: any) {
      console.error('Erro ao listar alunos:', error)
      throw new Error(
        error.response?.data?.message || 'Erro ao listar alunos'
      )
    }
  }

  async getStudent(id: string) {
    try {
      const response = await api.get<{ data: Student }>(
        `${this.baseUrl}/${id}`
      )
      return response
    } catch (error: any) {
      console.error('Erro ao buscar aluno:', error)
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar aluno'
      )
    }
  }
  async createStudent(data: CreateStudentPayload) {
    try {
      const response = await api.post<{ data: Student }>(
        this.baseUrl,
        data
      )
      return response
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error)
      throw new Error(
        error.response?.data?.message || 'Erro ao criar aluno'
      )
    }
  }

  async updateStudent(id: string, data: UpdateStudentPayload) {
    try {
      const response = await api.put<{ data: Student }>(
        `${this.baseUrl}/${id}`,
        data
      )
      return response
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error)
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar aluno'
      )
    }
  }

  async deleteStudent(id: string) {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`)
      return response
    } catch (error: any) {
      console.error('Erro ao deletar aluno:', error)
      throw new Error(
        error.response?.data?.message || 'Erro ao deletar aluno'
      )
    }
  }
}

export const studentService = new StudentService()