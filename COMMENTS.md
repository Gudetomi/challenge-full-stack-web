# 🚀 Evolução do Projeto: API Alunos (Fastify + Prisma + SOLID)

Este documento registra as decisões técnicas, a evolução da arquitetura e as práticas de engenharia de software implementadas na API.

## 🛠 O que já foi configurado & Implementado

O projeto evoluiu de uma configuração inicial para um ecossistema completo focado em **Clean Architecture** e **Segurança**:

- **Fastify & Autenticação JWT:** Implementada autenticação robusta utilizando o plugin `@fastify/jwt`. 
    - **Estratégia de Refresh Token:** Configurada via `HttpOnly Cookies`, garantindo que o usuário permaneça logado de forma segura e mitigando ataques de XSS.
- **TypeScript (Strict Mode):** Configuração de tipagem estrita, incluindo `exactOptionalPropertyTypes` para garantir que campos opcionais sejam tratados com precisão cirúrgica no fluxo de dados.
- **Zod:** Consolidação do Zod como a "fonte da verdade" para validação de `Request Body`, `Params` e `Query Strings` (com coerção de tipos para paginação).
- **Docker & Infraestrutura:** Orquestração de ambiente concluída com **Docker Compose**, garantindo que o banco de dados **PostgreSQL** e o ambiente de desenvolvimento sejam idênticos para todos os colaboradores.

## 🏗 Estrutura Arquitetural (Design Patterns)

O projeto amadureceu seguindo os princípios **SOLID** e padrões de projeto consolidados:

- **Repository Pattern:** Abstração total da camada de persistência.
    - `Prisma Repository`: Para produção, utilizando o Prisma ORM.
    - `In-Memory Repository`: Para testes unitários, permitindo velocidade, isolamento e feedback instantâneo.
- **Factory Pattern:** Implementação de fábricas para os serviços, centralizando a injeção de dependências e a criação de instâncias de repositórios.
- **Dependency Inversion (DIP):** O código de alto nível (Services/Use Cases) depende de interfaces, não de implementações concretas de banco de dados.



## 🧪 Estratégia de Testes

Implementamos uma pirâmide de testes utilizando **Vitest** e **Supertest**:

- **Testes Unitários:** Focados na lógica de negócio e regras de domínio (Services). Garantem que erros como e-mails duplicados ou recursos não encontrados sejam tratados corretamente sem tocar no banco de dados.
- **Testes E2E (End-to-End):** Validação do fluxo completo da aplicação (da rota ao banco).
    - **Isolamento por Schema:** Cada arquivo de teste roda em um schema isolado do banco de dados para evitar conflitos de dados.
    - **Fluxo de Autenticação:** Testes que simulam o registro, login e o uso do Token JWT para acessar rotas protegidas por middleware.
    - **CRUD Students:** Cobertura completa das rotas de Criação, Busca (com paginação e filtro), Atualização e Deleção.



## 🐳 Ambiente de Desenvolvimento & Persistência
- **Prisma ORM:** Gerenciamento de migrations concluído e sincronizado com os ambientes de teste e Docker.
- **Cookies & Segurança:** Implementação de `httpOnly`, `secure` (em produção) e `sameSite` para proteção de tokens sensíveis.

---
*Status Atual: Backend blindado por testes, CRUD de estudantes funcional e autenticação segura implementada.*
*Próximos passos: Implementação de CI/CD (GitHub Actions) e documentação da API via Swagger.*