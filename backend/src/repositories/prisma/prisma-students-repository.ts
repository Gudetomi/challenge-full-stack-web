import { prisma } from "@/lib/prisma";
import { Prisma, type Student } from 'prisma/generated/prisma/client';
import type { StudentsRepository } from "../student-repository";

export class PrismaStudentsRepository implements StudentsRepository {
  async create(data: Prisma.StudentUncheckedCreateInput) {
    const student = await prisma.student.create({
      data,
    })
    return student
  }
  async save(data: Student) {
    const student = await prisma.student.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        user_id: data.user_id,
      },
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
    
    const [students, total] = await prisma.$transaction([
      prisma.student.findMany({
        where,
        take: 10,
        skip: (page - 1) * 10,
        orderBy: { name: 'asc' },
      }),
      prisma.student.count({ where })
    ])
    return { students, total }
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
  async findByCpf(cpf: string) {
    const student = await prisma.student.findUnique({
      where: { cpf },
    });
    return student;
  }
  async findByRa(ra: string) {
    const student = await prisma.student.findUnique({
      where: { ra },
    });
    return student;
  }
}