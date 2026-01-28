import { register } from '@/http/controller/register';
import type { FastifyInstance } from "fastify";

export async function appRoutes(app:FastifyInstance) {
  app.post('/users', register)
}