# SmartFinance

Sistema de gestão financeira para a Paróquia Santo Expedito, desenvolvido como projeto acadêmico.

## Descrição

O SmartFinance tem como objetivo organizar e facilitar o controle financeiro da instituição. A proposta é substituir controles manuais ou dispersos por um sistema centralizado, permitindo registrar entradas e saídas de dinheiro, acompanhar movimentações financeiras e gerar informações que apoiem a tomada de decisão.

### Funcionalidades

- Cadastro de receitas (doações, contribuições, eventos, campanhas)
- Cadastro de despesas (contas, manutenção, compras e serviços)
- Controle de saldo e fluxo de caixa
- Emissão de relatórios financeiros por período (em desenvolvimento)
- Visualização simples e prática das movimentações

## Tecnologias

- Node.js
- TypeScript
- Express.js
- SQLite
- HTML/CSS/JavaScript (interface básica)

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o servidor: `npm run dev`
4. Acesse http://localhost:3000 no navegador

## Uso

- **Dashboard**: Visualize o saldo atual (receitas - despesas).
- **Receitas**: Adicione e visualize receitas.
- **Despesas**: Adicione e visualize despesas.

## API Endpoints

- `GET /api/receitas` - Listar todas as receitas
- `POST /api/receitas` - Criar nova receita
- `GET /api/despesas` - Listar todas as despesas
- `POST /api/despesas` - Criar nova despesa
- `GET /api/dashboard/saldo` - Obter saldo atual

## Estrutura do Projeto

```
src/
  controllers/     # Controladores da API
  models/          # Interfaces TypeScript
  routes/          # Definição das rotas
  database.ts      # Configuração do banco SQLite
  server.ts        # Ponto de entrada do servidor
public/            # Arquivos estáticos da interface web
docs/              # Documentação adicional
  planejamento.md  # Planejamento inicial
  diagrama.md      # Diagramas do sistema
```

## Desenvolvimento

- `npm run dev`: Executa o servidor em modo desenvolvimento.
- `npm run build`: Compila o TypeScript.
- `npm start`: Executa o servidor em produção.

## Contribuição

Este é um projeto acadêmico. Commits devem seguir convenções claras.

## Licença

Projeto acadêmico - sem licença específica.
