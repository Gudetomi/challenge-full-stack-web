import type { StudentsRepository } from '@/repositories/student-repository'
import type { Student } from 'prisma/generated/prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateStudentServiceRequest {
  studentId: string
  name: string
  email: string
  userId: string
}

interface UpdateStudentServiceResponse {
  student: Student
}

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({studentId,name,email,userId,}: UpdateStudentServiceRequest): Promise<UpdateStudentServiceResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      throw new ResourceNotFoundError()
    }

    const updatedStudent = await this.studentsRepository.save({
      ...student,
      name,
      email,
      user_id: userId,
    })

    return {
      student: updatedStudent,
    }
  }
}
