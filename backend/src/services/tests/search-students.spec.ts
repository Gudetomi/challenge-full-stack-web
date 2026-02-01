import { InMemoryStudentsRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchStudentsService } from '../search-students'

let studentsRepository: InMemoryStudentsRepository
let sut: SearchStudentsService

describe('Search Students Use Case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    sut = new SearchStudentsService(studentsRepository)
  })

  it('should be able to search for students', async () => {
    await studentsRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      ra: '123456',
      cpf: '123.456.789-00',
      user_id: 'user_123',
    })

    await studentsRepository.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      ra: '789012',
      cpf: '987.654.321-00',
      user_id: 'user_456',
    })

    await studentsRepository.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      ra: '789012',
      cpf: '987.654.321-00',
      user_id: 'user_456',
    })

    await studentsRepository.create({
      name: 'TypeScript Student',
      email: 'typescript.student@example.com',
      ra: '789012',
      cpf: '987.654.321-00',
      user_id: 'user_456',
    })

    const { students } = await sut.execute({
      query: 'John',
      page: 1,
    })

    expect(students).toHaveLength(1)
    expect(students).toEqual([expect.objectContaining({ name: 'John Doe' })])
  })

  it('should be able to fetch paginated student search', async () => {
    for (let i = 1; i <= 22; i++) {
      await studentsRepository.create({
        name: `JavaScript Student ${i}`,
        email: `javascript.student${i}@example.com`,
        ra: `123456${i}`,
        cpf: `123.456.789-${i}`,
        user_id: 'user_123',
      })
    }
    const { students } = await sut.execute({
      query: 'JavaScript',
      page: 3,
    })
    expect(students).toHaveLength(2)
    expect(students).toEqual([
      expect.objectContaining({ name: 'JavaScript Student 21' }),
      expect.objectContaining({ name: 'JavaScript Student 22' }),
    ])
  })
})