import { randomUUID } from "node:crypto";
import type { Prisma, Student } from 'prisma/generated/prisma/client';
import type { StudentsRepository } from "../student-repository";
export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []
  async findById(id: string) {
    const student = this.items.find(item => item.id === id)
    if(!student){
      return null
    }
    return student
  }
  async findByEmail(email: string) {
    const student = this.items.find(item => item.email === email)
    if(!student){
      return null
    }
    return student
  }
  async create(data: Prisma.StudentUncheckedCreateInput): Promise<Student> {
    const student = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      ra: data.ra,
      cpf: data.cpf,
      user_id: data.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(student)
    return student
  }
  async save(data: Student): Promise<Student> {
    const existingStudent = this.items.find(item => item.id === data.id)
    if (!existingStudent) {
      throw new Error('Student not found.')
    }
  
    const studentIndex = this.items.indexOf(existingStudent)
  
    const updatedStudent: Student = {
      ...existingStudent,
      ...(data as any), // Cast necessário para compatibilidade com tipos de operação do Prisma
      id: existingStudent.id, 
      updatedAt: new Date(),
    }
  
    this.items[studentIndex] = updatedStudent
    
    return updatedStudent
  }
  async searchMany(page: number, query: string) {
    const lowerCaseQuery = query.toLowerCase()
    return this.items
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.cpf.includes(lowerCaseQuery) ||
          item.ra.includes(lowerCaseQuery)
        )
      })
      .slice((page - 1) * 20, page * 20)
  }
  async delete(id: string): Promise<void> {
    const studentIndex = this.items.findIndex(item => item.id === id)
    if(studentIndex < 0){
      throw new Error('Student not found.')
    }
    this.items.splice(studentIndex, 1)
  }
}