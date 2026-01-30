import { create } from "@/http/controllers/students/create";
import { deleteStudent } from "@/http/controllers/students/delete";
import { search } from "@/http/controllers/students/search";
import { updateStudent } from "@/http/controllers/students/update";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function studentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/students', search)
  app.post('/students', create)
  app.put('/students/:id', updateStudent)
  app.delete('/students/:id', deleteStudent)
}