import { api } from '@/services/api';

export class StudentService {
  getAll(params?: { page?: number; search?: string }) {
    return api.get('/students', { params })
  }

  create(data: {
    name: string
    email: string
    ra: string
    cpf: string
  }) {
    return api.post('/students', data)
  }

  update(
    id: string,
    data: { name?: string; email?: string; ra?: string; cpf?: string },
  ) {
    return api.put(`/students/${id}`, data)
  }

  delete(id: string) {
    return api.delete(`/students/${id}`)
  }
}

export const studentService = new StudentService()
