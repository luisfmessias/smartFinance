# Planejamento Inicial - SmartFinance

## Visão Geral do Projeto
O SmartFinance é um sistema de gestão financeira desenvolvido para a Paróquia Santo Expedito, com o objetivo de substituir controles manuais por um sistema centralizado. O projeto visa facilitar o registro de receitas e despesas, controle de saldo e geração de relatórios.

## Objetivos
- Organizar e controlar as finanças da instituição.
- Permitir cadastro de receitas (doações, contribuições, eventos).
- Permitir cadastro de despesas (contas, manutenção, compras).
- Fornecer controle de saldo e fluxo de caixa.
- Gerar relatórios financeiros por período.
- Oferecer interface simples e acessível.

## Funcionalidades Planejadas
### Fase 1 (Avaliação Bimestre 1)
- Backend básico com API REST (Node.js + Express + TypeScript).
- Banco de dados SQLite para armazenamento.
- Endpoints CRUD para receitas e despesas.
- Endpoint para cálculo de saldo.
- Interface web simples (HTML/CSS/JS) para interação básica.
- Documentação inicial (README, planejamento).

### Fases Futuras
- Autenticação e autorização.
- Relatórios avançados (gráficos, filtros por data).
- Interface mais elaborada (React ou similar).
- Deploy em nuvem.
- Testes automatizados.

## Tecnologias
- **Backend**: Node.js, TypeScript, Express.js
- **Banco de Dados**: SQLite
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Ferramentas**: Git, GitHub, VS Code

## Estrutura do Projeto
```
smartFinance/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── database.ts
│   └── server.ts
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── docs/
│   ├── planejamento.md
│   └── diagrama.md
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Cronograma
- Semana 1: Planejamento e configuração inicial.
- Semana 2: Desenvolvimento do backend básico.
- Semana 3: Implementação do frontend simples.
- Semana 4: Testes e documentação para entrega.

## Riscos e Mitigações
- Falta de tempo: Focar no essencial para a avaliação.
- Dificuldades técnicas: Consultar documentação e pedir ajuda se necessário.
- Mudanças nos requisitos: Manter comunicação com o orientador.

## Critérios de Aceitação
- Sistema funcional com cadastro e visualização de receitas/despesas.
- Interface acessível via navegador.
- Código organizado e comentado.
- Repositório Git com commits regulares.