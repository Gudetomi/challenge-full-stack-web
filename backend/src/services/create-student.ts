import type { StudentsRepository } from "@/repositories/student-repository";
import type { Student } from 'prisma/generated/prisma/client';
import { StudentAlreadyExistsError } from "./errors/student/student-already-exists-error";

interface StudentServiceRequest{
  name: string;
  email: string;
  ra: string;
  cpf: string;
  userId: string;
}

interface StudentServiceResponse{
  student: Student;
}

export class CreateStudentService {
  constructor(private studentRepository: StudentsRepository){}

  async execute({ name, email, ra, cpf , userId}: StudentServiceRequest): Promise<StudentServiceResponse>{
    const studentAlreadyExists = await this.studentRepository.findByEmail(email)

    if(studentAlreadyExists){
      throw new StudentAlreadyExistsError()
    }

    const student = await this.studentRepository.create({
      name,
      email,
      ra,
      cpf,
      user_id: userId,
    })
    return {
      student,
    }
  }
}