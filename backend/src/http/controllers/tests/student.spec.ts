import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Students (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.student.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should be able to create a student', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()

    const response = await request(app.server)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gustavo Student',
        email: 'gustavo@student.com',
        ra: 'RA123456',
        cpf: '12345678901',
        userId: user.id,
      })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to search students by name', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()
    await prisma.student.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@example.com',
        ra: 'RA654321',
        cpf: '98765432100',
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .get('/students')
      .query({ q: 'Maria' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.students).toHaveLength(1)
    expect(response.body.students[0].name).toEqual('Maria Silva')
  })

  it('should be able to update a student', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()

    const student = await prisma.student.create({
      data: {
        name: 'Old Name',
        email: 'old@example.com',
        ra: 'RA999',
        cpf: '00000000000',
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        email: 'new@example.com',
        user_id: user.id,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.student.name).toEqual('New Name')
  })

  it('should be able to delete a student', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()

    const student = await prisma.student.create({
      data: {
        name: 'To Delete',
        email: 'delete@example.com',
        ra: 'RA000',
        cpf: '11111111111',
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .delete(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const studentInDb = await prisma.student.findUnique({
      where: { id: student.id },
    })

    expect(studentInDb).toBeNull()
  })
})