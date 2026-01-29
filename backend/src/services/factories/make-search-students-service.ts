import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { SearchStudentsService } from '@/services/search-students';

export function makeSearchStudentsService(){
    const studentsRepository = new PrismaStudentsRepository()
    const searchStudentsService = new SearchStudentsService(studentsRepository)
    return searchStudentsService
}