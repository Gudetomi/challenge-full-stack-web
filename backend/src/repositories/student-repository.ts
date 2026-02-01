import { Prisma, type Student } from 'prisma/generated/prisma/client';

export interface StudentsRepository{
  create(data: Prisma.StudentUncheckedCreateInput): Promise<Student>;
  save(data: Student): Promise<Student>;
  searchMany(page: number, query?: string): Promise<{
    students: Student[]
    total: number
  }>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  findByCpf(cpf: string): Promise<Student | null>;
  findByRa(ra: string): Promise<Student | null>;
}