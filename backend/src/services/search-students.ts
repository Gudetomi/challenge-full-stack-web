import type { StudentsRepository } from "@/repositories/student-repository";
import type { Student } from 'prisma/generated/prisma/client';

interface SearchStudentServiceRequest{
  query: string;
  page: number;
}

interface SearchStudentServiceResponse{
  students: Student[];
}

export class SearchStudentsService {
  constructor(private studentRepository: StudentsRepository){}

  async execute({ query, page }: SearchStudentServiceRequest): Promise<SearchStudentServiceResponse>{
    const students = await this.studentRepository.searchMany(page, query)
    return {
      students
    }
  }
}