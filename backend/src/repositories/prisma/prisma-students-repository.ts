import { prisma } from "@/lib/prisma";
import { Prisma } from 'prisma/generated/prisma/client';
import type { StudentsRepository } from "../student-repository";

export class PrismaStudentRepository implements StudentsRepository {
  async create(data: Prisma.StudentCreateInput) {
    const student = await prisma.student.create({
      data,
    })
    return student
  }
  async update(id: string, data: Prisma.StudentUpdateInput) {
    const student = await prisma.student.update({
      where: { id },
      data,
    });
    return student;
  }
  async findMany(page: number, query?: string) {
    const where: Prisma.StudentWhereInput = {}
    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      }
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
  
}