import { StudentAlreadyExistsError } from '@/services/errors/student/student-already-exists-error';
import { makeCreateStudentService } from '@/services/factories/make-create-student-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply){
  const createStudentBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      ra: z.string().min(6),
      cpf: z.string().min(11),
      userId: z.string(),
  })

  const { name, email, ra, cpf, userId } = createStudentBodySchema.parse(request.body)
  try {
    // dependency inversion principle
    const createStudentService = makeCreateStudentService()
    await createStudentService.execute({ name, email, ra, cpf, userId })
  } catch (error) {
    if (error instanceof StudentAlreadyExistsError){
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
  return reply.status(201).send()
}