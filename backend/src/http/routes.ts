import { authenticate } from '@/http/controller/authenticate';
import { profile } from '@/http/controller/profile';
import { register } from '@/http/controller/register';
import type { FastifyInstance } from "fastify";
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app:FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', {onRequest:[verifyJWT]},profile)
}