# Diagramas - SmartFinance

## Diagrama de Arquitetura
```
[Frontend (HTML/CSS/JS)] --> [API REST (Express)] --> [Banco SQLite]
```

## Diagrama de Fluxo de Dados
```
Usuário --> Interface Web --> API Endpoints --> Controladores --> Modelos --> Banco de Dados
```

## Diagrama de Classes (Simplificado)
```
Receita
- id: number
- descricao: string
- valor: number
- data: string
- categoria?: string

Despesa
- id: number
- descricao: string
- valor: number
- data: string
- categoria?: string
```

## Diagrama de Sequência (Cadastro de Receita)
```
Usuário -> Interface: Preenche formulário
Interface -> API: POST /api/receitas
API -> Controlador: create()
Controlador -> Banco: INSERT
Banco -> Controlador: Confirmação
Controlador -> API: Resposta
API -> Interface: Atualiza lista
Interface -> Usuário: Exibe confirmação
```