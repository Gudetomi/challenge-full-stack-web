import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-students-repository'
import { UpdateStudentService } from '@/services/update-student'

export function makeUpdateStudentService() {
  const studentsRepository = new PrismaStudentsRepository()
  const updateStudentService = new UpdateStudentService(studentsRepository)
  return updateStudentService
}
