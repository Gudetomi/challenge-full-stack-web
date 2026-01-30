import { InMemoryStudentsRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteStudentService } from '../delete-student'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let studentsRepository: InMemoryStudentsRepository
let sut: DeleteStudentService

describe('Delete Student Service', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    sut = new DeleteStudentService(studentsRepository)
  })

  it('should be able to delete a student', async () => {
    const createdStudent = await studentsRepository.create({
      name: 'To Delete',
      email: 'delete@example.com',
      ra: 'RA123',
      cpf: '123',
      user_id: 'user-01',
    })

    await sut.execute({ studentId: createdStudent.id })

    expect(studentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existing student', async () => {
    await expect(() =>
      sut.execute({ studentId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})