# SmartFinance

Sistema mobile-first para organizar gastos pessoais. O projeto foi feito com Next.js, React, TypeScript, Tailwind CSS e uma API Express opcional preparada para futura integracao com banco de dados.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Node.js
- Express

## Como rodar o projeto

Abra o terminal na pasta do projeto:

```bash
cd C:\Users\Freitas\Desktop\SmartFinance
```

Instale as dependencias:

```bash
npm install
```

Inicie o frontend:

```bash
npm run dev
```

Se o Next mostrar um erro fatal do Turbopack, rode o modo de desenvolvimento com Webpack:

```bash
npm run dev:webpack
```

Depois acesse no navegador:

```bash
http://localhost:3000
```

## API opcional

A interface funciona com dados locais no navegador. A API Express existe apenas como base para uma futura integracao.

Para rodar a API:

```bash
npm run server
```

A API sobe em:

```bash
http://localhost:3333
```

Rotas disponiveis:

- `GET /health`
- `GET /expenses`
- `POST /expenses`

Para conectar o frontend na API, crie um arquivo `.env` e adicione:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Build de producao

Para verificar se o projeto compila corretamente:

```bash
npm run build
```

Para rodar a versao de producao depois do build:

```bash
npm run start
```

## Dados locais

No momento, contas, gastos, orcamentos e preferencias ficam salvos no `localStorage` do navegador. Isso permite testar o app sem banco de dados.

Chaves usadas:

- `smartfinance.accounts`
- `smartfinance.expenses`
- `smartfinance.preferences`
- `smartfinance.session`

Para limpar os dados, use as ferramentas do navegador ou limpe o armazenamento local do site.

## Observacoes

- O app e focado em gerenciamento de gastos, nao em entrada e saida completa de dinheiro.
- Cada conta possui seus proprios gastos, preferencias e orcamentos.
- A senha e salva localmente como hash apenas para o prototipo. Em producao, a autenticacao deve ser substituida por uma solucao segura no backend.
