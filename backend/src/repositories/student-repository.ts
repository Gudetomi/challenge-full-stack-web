import { Prisma, type Student } from 'prisma/generated/prisma/client';

export interface StudentsRepository{
  create(data: Prisma.StudentCreateInput): Promise<Student>;
}