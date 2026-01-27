# 🚀 Início do Projeto: API Alunos (Fastify + Prisma + SOLID)

Este documento registra as decisões técnicas e a estrutura inicial da API.

## 🛠 O que já foi configurado (Initial Commit)

Até o momento, a base do projeto foi estabelecida com foco em **Developer Experience (DX)** e **Tipagem Estrita**:

- **Fastify:** Escolhido como framework web pela alta performance e ecossistema de plugins.
- **TypeScript:** Configurado para garantir segurança de tipos em todo o fluxo de dados.
- **Zod:** Implementado para validação de esquemas e contratos de rotas, servindo como a "fonte da verdade" para os tipos.
- **ESLint:** Padronização de código configurada para manter a consistência entre os arquivos.
- **npmrc:** Configurado para garantir que as versões das dependências sejam preservadas (`save-exact=true`) e o ambiente de pacotes seja estável.

## 🏗 Estrutura Arquitetural (SOLID)

O projeto seguirá os princípios SOLID:
- **S (SRP):** Divisão clara entre rotas, controllers e serviços.
- **D (DIP):** O Prisma não será chamado diretamente nas rotas; utilizaremos o padrão **Repository** para abstrair a camada de persistência.

## 🐳 Ambiente de Desenvolvimento
- O banco de dados **PostgreSQL** será gerenciado via **Docker** para garantir paridade entre os ambientes de desenvolvimento.

---
*Próximos passos: Configuração do Prisma Schema, Docker Compose e Middleware de Autenticação JWT.*