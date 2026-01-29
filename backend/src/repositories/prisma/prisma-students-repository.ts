import { prisma } from "@/lib/prisma";
import { Prisma, type Student } from 'prisma/generated/prisma/client';
import type { StudentsRepository } from "../student-repository";

export class PrismaStudentRepository implements StudentsRepository {
  async create(data: Prisma.StudentUncheckedCreateInput) {
    const student = await prisma.student.create({
      data,
    })
    return student
  }
  async save(data: Student) {
    const student = await prisma.student.update({
      where: { id: data.id },
      data: data,
    });
    return student;
  }
  async searchMany(page: number, query?: string) {
    const where: Prisma.StudentWhereInput = {}

    if (query) {
      const sanitizedQuery = query.replace(/[.-]/g, '')
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { cpf: { contains: sanitizedQuery } },
        { ra: { contains: sanitizedQuery } },
      ]
    }
    const students = await prisma.student.findMany({
      where,
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        name: 'asc',
      },
    });
    return students;
  }
  async delete(id: string) {
    await prisma.student.delete({
      where: { id },
    });
  }
  async findById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
    });
    return student;
  }
  async findByEmail(email: string) {
    const student = await prisma.student.findUnique({
      where: { email },
    });
    return student;
  }
}