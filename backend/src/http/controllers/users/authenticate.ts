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
    const { user } = await authenticateService.execute({ 
      email, 
      password 
    })
    const token = await reply.jwtSign(
      { sub: user.id,}
    )
    const refreshToken = await reply.jwtSign(
      { sub: user.id,},{
      sign: {
        expiresIn: '7d',
      }
    })

    return reply
    .setCookie('refreshToken',refreshToken,{
      path:'/',
      secure: true, // Para https
     sameSite:true,
     httpOnly:true,
    }).status(200).send({ 
      token,
     })
  } catch (error) {
    if (error instanceof UserInvalidCredentialsError){
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}