import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error'
import { makeUpdateStudentService } from '@/services/factories/make-update-student-service'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateStudent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(), // Ajustado para 'id' para bater com a rota /students/:id
  })

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  })

  // Se o Zod falhar aqui, o Fastify/Zod já retorna 400 automaticamente
  const { id } = paramsSchema.parse(request.params)
  const { name, email } = bodySchema.parse(request.body)

  try {
    const updateStudentService = makeUpdateStudentService()

    const { student } = await updateStudentService.execute({
      id,
      userId: request.user.sub,
      name ,
      email,
    })

    return reply.status(200).send({ student })
    
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}