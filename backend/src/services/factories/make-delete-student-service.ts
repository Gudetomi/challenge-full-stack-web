import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-students-repository'
import { DeleteStudentService } from '@/services/delete-student'

export function makeDeleteStudentService() {
  const studentsRepository = new PrismaStudentsRepository()
  const deleteStudentService = new DeleteStudentService(studentsRepository)
  return deleteStudentService
}
