# SmartFinance

Sistema mobile-first para organizar gastos pessoais, feito com Next.js, React, TypeScript e Tailwind CSS. O frontend e a API ficam na mesma aplicação, e a API é formada por Route Handlers em `app/api`.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma 7
- Zod (validação)
- jose (sessão assinada)

## Como rodar o projeto

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` a partir do `.env.example` e preencha as variáveis. Para gerar um `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Inicie o projeto:

```bash
npm run dev
```

Se o Next mostrar um erro fatal do Turbopack, use `npm run dev:webpack`.

Depois acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `AUTH_SECRET` | Assina o cookie de sessão. Mínimo de 32 caracteres. Obrigatória. |
| `APP_URL` | Endereço público do app, usado nos links de redefinição de senha. |
| `DATABASE_URL` | Conexão do Neon com pool (com `-pooler` no endereço), usada pela aplicação. |
| `DATABASE_URL_UNPOOLED` | Conexão direta do Neon, usada pelas migrações do Prisma. |

Na Vercel, as variáveis do banco são criadas pela integração com o Neon. `AUTH_SECRET` e `APP_URL` são configuradas no projeto.

## Banco de dados

Os dados ficam em PostgreSQL no Neon, acessado com Prisma. O schema está em [prisma/schema.prisma](prisma/schema.prisma), e as rotas acessam os dados apenas pela interface `DataStore` ([server/data/types.ts](server/data/types.ts)).

O ambiente local usa o mesmo banco da produção, a menos que o `.env.local` aponte para outro.

Para alterar o schema, edite o arquivo e crie uma migração:

```bash
npm run db:migrate -- --name descricao-da-mudanca
```

Para aplicar migrações pendentes manualmente:

```bash
npx prisma migrate deploy
```

Na Vercel, as migrações pendentes são aplicadas durante o build (`vercel-build`). Isso vale também para deploys de Preview, que usam o mesmo banco.

## API

Sessão por cookie `HttpOnly`. Todas as rotas abaixo ficam em `/api`.

| Método e rota | Descrição | Exige sessão |
|---|---|---|
| `GET /health` | Verifica se a API e o armazenamento estão disponíveis | Não |
| `POST /auth/register` | Cria a conta e inicia a sessão | Não |
| `POST /auth/login` | Inicia a sessão | Não |
| `POST /auth/logout` | Encerra a sessão atual | Não |
| `GET /auth/me` | Retorna a conta da sessão, ou `null` | Não |
| `POST /auth/forgot-password` | Envia o link de redefinição de senha | Não |
| `POST /auth/reset-password` | Define uma nova senha usando o token do link | Não |
| `POST /auth/password` | Altera a senha e encerra as outras sessões | Sim |
| `POST /auth/logout-all` | Encerra as outras sessões | Sim |
| `PATCH /account` | Atualiza nome e e-mail | Sim |
| `GET /expenses` | Lista os gastos | Sim |
| `POST /expenses` | Cria um gasto | Sim |
| `PATCH /expenses/:id` | Atualiza um gasto | Sim |
| `DELETE /expenses/:id` | Exclui um gasto | Sim |
| `GET /preferences` | Retorna orçamentos e preferências | Sim |
| `PUT /preferences` | Salva orçamentos e preferências | Sim |

Erros seguem o formato `{ "error": "mensagem" }`.

## Recuperação de senha

Ainda não há provedor de e-mail. Em desenvolvimento, o link de redefinição aparece no terminal do `npm run dev`. Em produção, a rota responde `503` até um provedor ser conectado em [server/mail.ts](server/mail.ts).

## Verificações

```bash
npm run typecheck
npm run build
```

## Observações

- O app é focado em gerenciamento de gastos, não em entrada e saída completa de dinheiro.
- Cada conta possui seus próprios gastos, preferências e orçamentos.
- As senhas são guardadas com scrypt e salt individual.
