import type { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply){
  await request.jwtVerify({ onlyCookie: true })
  
    const token = await reply.jwtSign(
      { sub: request.user.sub,}
    )
    const refreshToken = await reply.jwtSign(
      { sub: request.user.sub,},{
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
}