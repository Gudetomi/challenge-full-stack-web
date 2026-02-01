import { create } from "@/http/controllers/students/create";
import { deleteStudent } from "@/http/controllers/students/delete";
import { search } from "@/http/controllers/students/search";
import { updateStudent } from "@/http/controllers/students/update";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

export async function studentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // 1. Listar/Buscar Alunos
  app.get('/students', {
    schema: {
      summary: 'Listar e buscar alunos',
      tags: ['Students'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        query: z.string().optional().describe('Termo de busca (nome, email ou RA)'),
        page: z.coerce.number().min(1).default(1),
      }),
      response: {
        200: z.object({
          students: z.array(z.any()),
          total: z.number(),
          page: z.number()
        })
      }
    }
  }, search)

  // 2. Criar Aluno (Somente ADMIN)
  app.post('/students', { 
    onRequest: [verifyUserRole('ADMIN')],
    schema: {
      summary: 'Cadastrar aluno',
      tags: ['Students'],
      security: [{ bearerAuth: [] }],
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        ra: z.string(),
        cpf: z.string().length(11),
      }),
      response: {
        201: z.object({
          student: z.object({
            id: z.string(),
            name: z.string(),
          })
        })
      }
    }
  }, create)

  // 3. Atualizar Aluno (Somente ADMIN)
  app.put('/students/:id', { 
    onRequest: [verifyUserRole('ADMIN')],
    schema: {
      summary: 'Atualizar aluno',
      tags: ['Students'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        ra: z.string().optional(),
        cpf: z.string().optional(),
      }),
      response: {
        204: z.null(),
      }
    }
  }, updateStudent)

  // 4. Excluir Aluno (Somente ADMIN)
  app.delete('/students/:id', { 
    onRequest: [verifyUserRole('ADMIN')],
    schema: {
      summary: 'Excluir aluno',
      tags: ['Students'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: {
        204: z.null(),
      }
    }
  }, deleteStudent)
}