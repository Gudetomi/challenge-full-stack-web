import { Prisma, type Student } from 'prisma/generated/prisma/client';

export interface StudentsRepository{
  create(data: Prisma.StudentCreateInput): Promise<Student>;
  update(id: string, data: Prisma.StudentUpdateInput): Promise<Student>;
  findMany(page: number, query?: string): Promise<Student[]>;
  delete(id: string): Promise<void>;
}