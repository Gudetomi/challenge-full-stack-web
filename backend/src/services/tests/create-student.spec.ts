import { InMemoryStudentsRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateStudentService } from '../create-student'
import { StudentAlreadyExistsError } from '../errors/student/student-already-exists-error'

let studentsRepository: InMemoryStudentsRepository
let sut: CreateStudentService

describe('Create Student Service', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    sut = new CreateStudentService(studentsRepository)
  })

  it('should be able to create a student', async () => {
    const { student } = await sut.execute({
      name: 'Gustavo',
      email: 'gustavo@example.com',
      ra: '123456',
      cpf: '12345678901',
      userId: 'user-01',
    })

    expect(student.id).toEqual(expect.any(String))
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'gustavo@example.com'

    await sut.execute({
      name: 'Gustavo',
      email,
      ra: '123456',
      cpf: '12345678901',
      userId: 'user-01',
    })

    await expect(() =>
      sut.execute({
        name: 'Outro Nome',
        email,
        ra: '654321',
        cpf: '00000000000',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(StudentAlreadyExistsError)
  })
})