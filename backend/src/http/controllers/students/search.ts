import { makeSearchStudentsService } from '@/services/factories/make-search-students-service'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchStudentsQuerySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
  })
  const { query, page } = searchStudentsQuerySchema.parse(request.query)
  const searchStudentsService = makeSearchStudentsService()
  const { students } = await searchStudentsService.execute({
    query,
    page,
  })

  return reply.status(200).send({
    students,
  })
}