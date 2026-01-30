import type { StudentsRepository } from '@/repositories/student-repository'
import type { Student } from 'prisma/generated/prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateStudentServiceRequest {
  id: string
  name?: string | undefined
  email?: string | undefined
  userId: string
}

interface UpdateStudentServiceResponse {
  student: Student
}

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({id,name,email,userId,}: UpdateStudentServiceRequest): Promise<UpdateStudentServiceResponse> {
    const student = await this.studentsRepository.findById(id)

    if (!student) {
      throw new ResourceNotFoundError()
    }
    
    const studentToUpdate = {
      ...student,
      name: name ?? student.name,
      email: email ?? student.email,
      user_id: userId,
    }

    const updatedStudent = await this.studentsRepository.save(studentToUpdate)

    return {
      student: updatedStudent,
    }
  }
}
