import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from './authenticate';
import { profile } from './profile';
import { refresh } from "./refresh";
import { register } from './register';

export async function userRoutes(app: FastifyInstance) {
  // 1. Registro de Usuário
  app.post('/users', {
    schema: {
      summary: 'Registrar novo usuário',
      tags: ['Auth'],
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      }),
      response: {
        201: z.null(),
      }
    }
  }, register)

  // 2. Autenticação (Login)
  app.post('/sessions', {
    schema: {
      summary: 'Autenticar usuário (Login)',
      tags: ['Auth'],
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({
          token: z.string(),
        })
      }
    }
  }, authenticate)

  // 3. Refresh Token
  app.patch('/token/refresh', {
    schema: {
      summary: 'Renovar token JWT',
      description: 'Utiliza o Refresh Token enviado via Cookie para gerar um novo JWT.',
      tags: ['Auth'],
      response: {
        200: z.object({
          token: z.string(),
        })
      }
    }
  }, refresh)

  // 4. Perfil do Usuário
  app.get('/me', {
    onRequest: [verifyJWT],
    schema: {
      summary: 'Obter perfil do usuário logado',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            role: z.string(),
            createdAt: z.coerce.string(), 
          })
        })
      }
    }
  }, profile)
}