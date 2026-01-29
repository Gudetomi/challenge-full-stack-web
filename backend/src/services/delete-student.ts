import type { StudentsRepository } from '@/repositories/student-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteStudentServiceRequest {
  studentId: string
}

export class DeleteStudentService {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({ studentId }: DeleteStudentServiceRequest): Promise<void> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      throw new ResourceNotFoundError()
    }

    await this.studentsRepository.delete(studentId)
  }
}
