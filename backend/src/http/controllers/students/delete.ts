import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error';
import { makeDeleteStudentService } from '@/services/factories/make-delete-student-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function deleteStudent(request: FastifyRequest, reply: FastifyReply) {
  const deleteStudentParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteStudentParamsSchema.parse(request.params)

  try {
    const deleteStudentService = makeDeleteStudentService()
    await deleteStudentService.execute({ studentId:id })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }

  return reply.status(204).send()
}