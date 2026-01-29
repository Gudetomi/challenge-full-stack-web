import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { CreateStudentService } from '@/services/create-student';

export function makeCreateStudentService(){
    const studentsRepository = new PrismaStudentsRepository()
    const createStudentService = new CreateStudentService(studentsRepository)
    return createStudentService
}