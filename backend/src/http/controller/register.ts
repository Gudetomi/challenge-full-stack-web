import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterService } from '@/services/register';
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
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)
    await registerService.execute({ name, email, password })
  } catch (error) {
      return reply.status(409).send({ message: (error as Error).message })
  }
  return reply.status(201).send()
}