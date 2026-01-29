import { UserAlreadyExistsError } from '@/services/errors/user/user-already-exists-error';
import { makeRegisterService } from '@/services/factories/make-register-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply){
  const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
  })
  
  const { name, email, password } = registerBodySchema.parse(request.body)
  try {
    // dependency inversion principle
    const registerService = makeRegisterService()
    await registerService.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError){
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
  return reply.status(201).send()
}