import { InMemoryStudentsRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UpdateStudentService } from '../update-student'

let studentsRepository: InMemoryStudentsRepository
let sut: UpdateStudentService

describe('Update Student Service', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    sut = new UpdateStudentService(studentsRepository)
  })

  it('should be able to update a student', async () => {
    const createdStudent = await studentsRepository.create({
      name: 'Original Name',
      email: 'original@example.com',
      ra: 'RA123',
      cpf: '123',
      user_id: 'user-01',
    })

    const { student } = await sut.execute({
      id: createdStudent.id,
      name: 'Updated Name',
      email: 'updated@example.com',
      userId: 'user-01',
    })

    expect(student.name).toEqual('Updated Name')
    expect(student.email).toEqual('updated@example.com')
  })

  it('should not be able to update a non-existing student', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existing-id',
        name: 'New Name',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})