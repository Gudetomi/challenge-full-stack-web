import type { StudentsRepository } from "@/repositories/student-repository";
import type { Student } from 'prisma/generated/prisma/client';

interface SearchStudentServiceRequest{
  query?: string | undefined;
  page: number;
}

interface SearchStudentServiceResponse{
  students: Student[];
  total:number,
  page:number
}

export class SearchStudentsService {
  constructor(private studentRepository: StudentsRepository){}

  async execute({ query, page }: SearchStudentServiceRequest): Promise<SearchStudentServiceResponse>{
    const { students,total } = await this.studentRepository.searchMany(page, query)
    return {
      students,
      total,
      page
    }
  }
}