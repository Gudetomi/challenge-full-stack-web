import { studentRoutes } from '@/http/controllers/students/routes';
import { userRoutes } from '@/http/controllers/users/routes';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';

export const app = fastify()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
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
      title: 'API Alunos',
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
  transform: jsonSchemaTransform, // <- Use isso em vez da sua função manual
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