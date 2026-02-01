# 📋 COMMENTS.md - Backend Challenge Full Stack Web

## 📌 Visão Geral

Este projeto é o **backend** do desafio **Challenge Full Stack Web**, desenvolvido com **Fastify**, **Prisma**, **TypeScript** e **PostgreSQL**. É um sistema de gerenciamento de alunos com autenticação JWT, construído seguindo os princípios de **Clean Architecture** e **Domain-Driven Design**.

**Repositório Principal:** [grupo-a/challenge-full-stack-web](https://github.com/grupo-a/challenge-full-stack-web)

**Stack Tecnológico:**
- **Framework:** Fastify 5.7.2 (Node.js)
- **Linguagem:** TypeScript 5.9.3
- **ORM:** Prisma 7.3.0 com PostgreSQL
- **Autenticação:** JWT com refresh token em cookies
- **Validação:** Zod 4.3.6
- **Documentação API:** Swagger/OpenAPI
- **Testes:** Vitest 4.0.18 (Unit e E2E)
- **Segurança:** bcryptjs para hash de senhas

---

## 🏗️ Arquitetura do Projeto

O projeto segue **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── @types/              # Tipos e interfaces globais
├── env/                 # Configurações de variáveis de ambiente
├── http/
│   ├── controllers/     # Controllers (handlers das rotas)
│   ├── middlewares/     # Middlewares de autenticação
│   └── routes/
├── repositories/        # Camada de acesso a dados (padrão Repository)
│   ├── prisma/         # Implementação com Prisma
│   └── in-memory/      # Implementação em memória (para testes)
├── services/           # Lógica de negócio (Use Cases)
│   ├── factories/      # Factory Pattern (injeção de dependências)
│   ├── errors/         # Erros customizados do domínio
│   └── tests/          # Testes unitários dos serviços
├── lib/                # Bibliotecas e utilities
├── utils/              # Funções auxiliares
├── app.ts              # Configuração da aplicação Fastify
└── server.ts           # Ponto de entrada do servidor
```

---

## 🔑 Componentes Principais

### 1. **Controllers** (`src/http/controllers/`)

Responsáveis por receber requisições HTTP e delegar para os serviços.

#### Estrutura:
- **`users/`** - Autenticação e gestão de usuários
  - `register.ts` - Registrar novo usuário
  - `authenticate.ts` - Fazer login
  - `refresh.ts` - Renovar token JWT
  - `profile.ts` - Obter perfil do usuário autenticado

- **`students/`** - Gestão de alunos
  - `create.ts` - Criar novo aluno
  - `search.ts` - Listar/buscar alunos com paginação
  - `update.ts` - Atualizar dados do aluno
  - `delete.ts` - Deletar aluno

#### Exemplo de uso:
```typescript
// Controllers utilizam factory pattern para obter serviços injetados
const service = makeCreateStudentService()
await service.execute(data)
```

---

### 2. **Services** (`src/services/`)

Contêm toda a lógica de negócio e validações.

#### Principais serviços:

**`RegisterService`** - Registra novo usuário
- Valida email único
- Hash de senha com bcryptjs
- Retorna usuário criado

**`AuthenticateService`** - Autentica usuário
- Valida credenciais
- Gera JWT com expiração de 10 minutos
- Gera refresh token em cookie

**`CreateStudentService`** - Cria novo aluno
- Valida email, CPF e RA únicos
- Associa aluno ao usuário autenticado
- Valida CPF com algoritmo específico

**`SearchStudentsService`** - Lista alunos
- Suporta paginação
- Filtra por usuário
- Retorna total de registros

**`UpdateStudentService`** - Atualiza dados do aluno
- Valida unicidade de email, CPF e RA (exceto registro atual)
- Verifica propriedade do aluno

**`DeleteStudentService`** - Deleta aluno
- Valida propriedade do aluno
- Remove do banco de dados

#### Tratamento de Erros:
- `UserAlreadyExistsError` - Usuário duplicado
- `UserInvalidCredentialsError` - Credenciais inválidas
- `StudentAlreadyExistsError` - Aluno duplicado
- `StudentNotFoundError` - Aluno não encontrado
- `ResourceNotFoundError` - Recurso genérico não encontrado

---

### 3. **Repositories** (`src/repositories/`)

Implementam o padrão **Repository** para abstração de dados.

#### Estrutura:

**Interfaces (contratos):**
- `StudentsRepository` - Contrato para operações com alunos
- `UsersRepository` - Contrato para operações com usuários

**Implementações:**

**Prisma** (`prisma/`):
- `PrismaStudentsRepository` - Operações com alunos no BD
- `PrismaUsersRepository` - Operações com usuários no BD

**In-Memory** (`in-memory/`):
- `InMemoryStudentsRepository` - Mock de alunos (testes)
- `InMemoryUsersRepository` - Mock de usuários (testes)

#### Métodos principais:

```typescript
// Students Repository
findByEmail(email: string)
findByCpf(cpf: string)
findByRa(ra: string)
findById(id: string)
create(data: StudentCreateInput)
update(id: string, data: StudentUpdateInput)
delete(id: string)
findManyByUserId(userId: string, page: number, limit: number)
countByUserId(userId: string)

// Users Repository
findByEmail(email: string)
findById(id: string)
create(data: UserCreateInput)
```

**Benefício:** Fácil trocar entre implementações (Prisma, MongoDB, etc.) sem alterar os serviços.

---

### 4. **Factories** (`src/services/factories/`)

Implementam o **Factory Pattern** para injeção de dependências.

Cada serviço possui uma factory correspondente:

```typescript
// make-create-student-service.ts
export function makeCreateStudentService() {
  const repository = new PrismaStudentsRepository()
  return new CreateStudentService(repository)
}
```

**Benefício:** 
- Centraliza criação de instâncias
- Facilita trocar implementações em um único local
- Melhora testabilidade

---

### 5. **Middleware** (`src/http/middlewares/`)

Middlewares de autenticação JWT.

**`verifyJwt`** - Valida token JWT
- Extrai token do header `Authorization: Bearer <token>`
- Valida assinatura e expiração
- Injeta usuário autenticado na requisição

---

### 6. **Configurações de Ambiente** (`src/env/`)

Gerencia variáveis de ambiente com validação Zod.

**Variáveis obrigatórias:**
- `NODE_ENV` - Ambiente (development/test/production)
- `DATABASE_URL` - URL de conexão PostgreSQL
- `JWT_SECRET` - Chave secreta para assinar JWTs
- `FRONTEND_URL` - URL do frontend (para CORS)

---

### 7. **Banco de Dados** (`prisma/`)

#### Schema (`schema.prisma`):

**Tabela `users`**
```prisma
- id: String @id @default(cuid())
- email: String @unique
- password_hash: String
- created_at: DateTime @default(now())
- students: Student[]  // Relação 1:N
```

**Tabela `students`**
```prisma
- id: String @id @default(cuid())
- name: String
- email: String @unique
- ra: String @unique
- cpf: String @unique
- user_id: String  // FK para users
- created_at: DateTime @default(now())
- updated_at: DateTime @updatedAt
- user: User       // Relação N:1
```

#### Migrations:
Localizadas em `prisma/migrations/` para controle de versão do schema.

#### Seed:
`prisma/seed.ts` - Dados iniciais para desenvolvimento (executar com `npx prisma db seed`).

---

## 🔐 Autenticação e Autorização

### Fluxo JWT:

1. **Registro:** Usuário se registra com email/senha
2. **Login:** Usuário faz login → recebe JWT + refresh token em cookie
3. **Requisições:** JWT é enviado no header `Authorization: Bearer <token>`
4. **Validação:** Middleware `verifyJwt` valida token em cada rota protegida
5. **Renovação:** Endpoint `/refresh` regenera tokens antes de expirar

### Configuração JWT:

```typescript
// app.ts
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',  // Token expira em 10 minutos
  },
})
```

---

## 📚 Rotas da API

### Autenticação (`/users`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/register` | Registrar novo usuário | ❌ |
| POST | `/authenticate` | Fazer login | ❌ |
| POST | `/refresh` | Renovar tokens JWT | ✅ |
| GET | `/profile` | Obter perfil autenticado | ✅ |

### Alunos (`/students`)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/` | Criar novo aluno | ✅ |
| GET | `/` | Listar alunos com paginação | ✅ |
| PUT | `/:studentId` | Atualizar aluno | ✅ |
| DELETE | `/:studentId` | Deletar aluno | ✅ |

### Documentação

| Rota | Descrição |
|------|-----------|
| `/docs` | Swagger UI com documentação interativa |
| `/docs/json` | Especificação OpenAPI em JSON |

---

## 🧪 Testes

O projeto possui cobertura de testes **Unit** e **E2E** com Vitest.

### Estrutura:

```
src/
├── services/tests/       # Testes de serviços (lógica)
│   ├── authenticate.spec.ts
│   ├── register.spec.ts
│   ├── create-student.spec.ts
│   ├── update-student.spec.ts
│   ├── delete-student.spec.ts
│   ├── search-students.spec.ts
│   └── get-user-profile.spec.ts
│
└── http/controllers/tests/  # Testes E2E (rotas)
    ├── register.spec.ts
    ├── authenticate.spec.ts
    ├── refresh.spec.ts
    ├── profile.spec.ts
    └── student.spec.ts
```

### Executar testes:

```bash
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:watch        # Watch mode para unit tests
npm run test:watch:e2e    # Watch mode para E2E
npm run test:coverage     # Com cobertura
npm run test:ui           # Interface gráfica
```

### Exemplo de teste unitário:

```typescript
// services/tests/create-student.spec.ts
it('should create a new student', async () => {
  const service = new CreateStudentService(repository)
  
  const result = await service.execute({
    name: 'John Doe',
    email: 'john@example.com',
    ra: '202301',
    cpf: '12345678901',
    userId: 'user-1'
  })
  
  expect(result.student).toBeDefined()
  expect(repository.create).toHaveBeenCalled()
})
```

---

## 🚀 Começando

### Instalação:

```bash
npm install
```

### Configurar variáveis de ambiente:

```bash
# .env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/students
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### Executar migrações:

```bash
npx prisma migrate dev
```

### Iniciar servidor:

```bash
npm run start:dev  # Desenvolvimento (com hot reload)
npm run start      # Produção (build obrigatório)
npm run build      # Compilar TypeScript
```

### Acessar documentação:

Abra [http://localhost:3333/docs](http://localhost:3333/docs)

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Inicia servidor em modo desenvolvimento com reload automático |
| `npm run start` | Inicia servidor de produção |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:watch:e2e` | Testes E2E em modo watch |
| `npm run test:coverage` | Testes com cobertura de código |
| `npm run test:ui` | Interface gráfica para testes |

---

## 🔍 Detalhes Técnicos Importantes

### 1. **Validação com Zod**

Todos os inputs são validados com Zod antes de chegar aos serviços:

```typescript
const createStudentSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  ra: z.string(),
  cpf: z.string().refine(validateCpf, 'Invalid CPF'),
})
```

### 2. **CPF Validation**

Implementado em `src/utils/validate-cpf.ts` com algoritmo oficial:

```typescript
export function validateCpf(cpf: string): boolean {
  // Algoritmo de validação de CPF brasileiro
  // Valida dígitos verificadores
}
```

### 3. **CORS Configuration**

Configurado para aceitar requisições apenas do frontend autorizado:

```typescript
app.register(fastifyCors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})
```

### 4. **Error Handling Global**

Handler global de erros na app.ts:

```typescript
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }
  
  return reply.status(500).send({ message: 'Internal server error' })
})
```

### 5. **Swagger/OpenAPI**

Documentação automática das rotas com Zod to JSON Schema:

```typescript
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Alunos - Challenge Full Stack',
      version: '1.0.0',
    },
  },
  transform: ({ schema, url }) => {
    // Transforma schemas Zod em JSON Schema
  },
})
```

---

## 🎯 Padrões e Princípios Utilizados

### Design Patterns:

1. **Repository Pattern** - Abstração de dados
2. **Factory Pattern** - Injeção de dependências
3. **Singleton** - Instância única do Fastify e Prisma
4. **Service Layer Pattern** - Lógica de negócio isolada
5. **Dependency Injection** - Inversão de controle

### SOLID Principles:

- **S**ingle Responsibility - Controllers, Services e Repositories com uma responsabilidade
- **O**pen/Closed - Extensível sem modificar código existente
- **L**iskov Substitution - Repositories intercambiáveis (Prisma/In-Memory)
- **I**nterface Segregation - Interfaces específicas e mínimas
- **D**ependency Inversion - Depende de abstrações, não de implementações concretas

---

## 🐛 Tratamento de Erros

O projeto usa classes de erro customizadas para domínio:

```typescript
// src/services/errors/
├── resource-not-found-error.ts
├── student/
│   ├── student-already-exists-error.ts
│   └── student-not-found-error.ts
└── user/
    ├── user-already-exists-error.ts
    └── user-invalid-credentials-error.ts
```

Cada erro estende `Error` e é capturado nos controllers para retornar status HTTP apropriado.

---

## 📊 Fluxo de Dados

### Criação de Aluno:

```
Controller (HTTP Request)
         ↓
    Validação Zod
         ↓
CreateStudentService (Lógica de negócio)
         ↓
StudentsRepository.create() (Acesso a dados)
         ↓
Prisma (ORM)
         ↓
PostgreSQL (Banco)
         ↓
StudentResponse (HTTP Response)
```

---

## 🔧 Dependências Principais

### Produção:
- **fastify** - Framework web rápido
- **@fastify/jwt** - Autenticação JWT
- **@fastify/cors** - CORS
- **@fastify/swagger** - Documentação OpenAPI
- **@prisma/client** - ORM para banco de dados
- **bcryptjs** - Hash de senhas
- **zod** - Validação de esquemas

### Desenvolvimento:
- **vitest** - Framework de testes
- **supertest** - Testes HTTP
- **typescript** - Type safety
- **eslint** - Linting de código

---

## 📝 Variáveis de Ambiente

```env
# Obrigatórias
NODE_ENV=development                                    # Ambiente
DATABASE_URL=postgresql://user:pass@localhost:5432/db  # PostgreSQL
JWT_SECRET=your-super-secret-key-min-32-chars          # JWT Secret
FRONTEND_URL=http://localhost:3000                      # Frontend URL
```

---

## 🎓 Conceitos Avançados

### Injeção de Dependências (DI):

```typescript
// make-create-student-service.ts
export function makeCreateStudentService() {
  const repository = new PrismaStudentsRepository()
  return new CreateStudentService(repository)
}

// controller
const service = makeCreateStudentService()
const result = await service.execute(data)
```

Facilita:
- Testes (usar mock repository)
- Manutenção (trocar implementação)
- Escalabilidade

### Repositories para Testes:

```typescript
// tests usam in-memory repository
const repository = new InMemoryStudentsRepository()
const service = new CreateStudentService(repository)

// Sem dependência do banco de dados ✅
```

---

## 🚀 Deploy

### Build para produção:

```bash
npm run build
NODE_ENV=production npm start
```

### Docker:

Arquivo `docker-compose.yml` disponível para executar PostgreSQL:

```bash
docker-compose up -d
```

## ✅ Checklist de Features

- ✅ Autenticação com JWT
- ✅ Refresh token em cookie
- ✅ CRUD completo de alunos
- ✅ Validação de CPF
- ✅ Testes unitários
- ✅ Testes E2E
- ✅ Documentação Swagger
- ✅ Tratamento de erros global
- ✅ CORS configurado
- ✅ Migrations com Prisma
- ✅ Seed de dados
- ✅ Variáveis de ambiente validadas
