import { app } from '@/app'
import { prisma } from '@/lib/prisma'
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
    // Limpa os dados para garantir isolamento total entre os testes
    // A ordem importa devido às Foreign Keys: Students primeiro, depois Users
    await prisma.student.deleteMany()
    await prisma.user.deleteMany()
  })

  /**
   * Helper para autenticação.
   * Como limpamos o banco no beforeEach, precisamos criar o usuário sempre.
   */
  async function createAuthenticatedUser() {
    const email = 'admin@example.com'

    await request(app.server).post('/users').send({
      name: 'Admin',
      email,
      password: 'password123',
    })

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    })

    const { token } = authResponse.body

    return { 
      token, 
      userId: user.id 
    }
  }

  it('should be able to create a student', async () => {
    const { token, userId } = await createAuthenticatedUser()

    const response = await request(app.server)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gustavo Student',
        email: 'gustavo@student.com',
        ra: 'RA123456',
        cpf: '12345678901',
        userId: userId,
      })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to search students by name', async () => {
    const { token, userId } = await createAuthenticatedUser()

    // Como o beforeEach limpou o banco, este será o ÚNICO estudante
    await prisma.student.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@example.com',
        ra: 'RA654321',
        cpf: '98765432100',
        user_id: userId,
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
    const { token, userId } = await createAuthenticatedUser()

    const student = await prisma.student.create({
      data: {
        name: 'Old Name',
        email: 'old@example.com',
        ra: 'RA999',
        cpf: '00000000000',
        user_id: userId,
      },
    })

    const response = await request(app.server)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        email: 'new@example.com',
        userId: userId,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.student.name).toEqual('New Name')
  })

  it('should be able to delete a student', async () => {
    const { token, userId } = await createAuthenticatedUser()

    const student = await prisma.student.create({
      data: {
        name: 'To Delete',
        email: 'delete@example.com',
        ra: 'RA000',
        cpf: '11111111111',
        user_id: userId,
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