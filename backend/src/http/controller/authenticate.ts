import { UserInvalidCredentialsError } from '@/services/errors/user/user-invalid-credentials-error';
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply){
  const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
  })
  
  const { email, password } = authenticateBodySchema.parse(request.body)
  try {
    // dependency inversion principle
    const authenticateService = makeAuthenticateService()
    await authenticateService.execute({ 
      email, 
      password 
    })
  } catch (error) {
    if (error instanceof UserInvalidCredentialsError){
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
  return reply.status(200).send()
}