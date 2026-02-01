import { studentRoutes } from '@/http/controllers/students/routes';
import { userRoutes } from '@/http/controllers/users/routes';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { env } from './env';



export const app = fastify()
app.register(fastifyCookie)

app.register(fastifyCors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
})

app.register(fastifyJwt,{
  secret:env.JWT_SECRET,
  cookie:{
    cookieName: 'refreshToken',
    signed: false,
  },
  sign:{
    expiresIn: '10m',
  },
})


app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Alunos - Challenge Full Stack',
      description: 'Documentação do sistema de gerenciamento de alunos.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: ({ schema, url }) => {
    if (!schema) return { schema, url }
  
    const { params, body, querystring, response, ...rest } = schema as any
    const transformed: any = { ...rest }
  
    if (params) transformed.params = zodToJsonSchema(params)
    if (body) transformed.body = zodToJsonSchema(body)
    if (querystring) transformed.querystring = zodToJsonSchema(querystring)
    if (response) transformed.response = zodToJsonSchema(response)
  
    return { schema: transformed, url }
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(userRoutes)
app.register(studentRoutes)

app.setErrorHandler((error, _, reply) => {
  if(error instanceof ZodError){
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }
  
  if(env.NODE_ENV !== 'production'){
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})