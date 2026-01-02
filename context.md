# Contexto do Projeto — Sistema de Controle de Gastos Pessoais

Este é um rastreador de finanças pessoais **apenas frontend**, focado em uma UX limpa, elegante e intuitiva.

## Recursos Principais

- Registrar **gastos fixos** (assinaturas, internet, etc.)
- Registrar **gastos variáveis** com categorias de pagamento: **débito, dinheiro, pix**
- Registrar **compras no crédito**:
  - crédito (pagamento único)
  - crédito (parcelado) que **propaga para meses subsequentes**
- Registrar renda:
  - **renda mensal**
  - **renda extra**
- Registrar deduções para:
  - **poupança (economias)**
  - **reserva de lazer mensal (reserva-lazer)** com status:
    - **disponível** quando reserva >= gastos de lazer
    - **negativa** quando gastos de lazer > reserva

## Requisitos do Dashboard

- Um lindo **dashboard mensal** com um seletor de mês
- Indicadores mensais:
  - Gastos totais + comparações (vs mês anterior)
  - Poupança total + comparações (vs mês anterior)
  - Status da reserva de lazer: **disponível / negativa**
- O dashboard deve ser fácil de ler e amigável.

## Restrições

- Use **HTML, CSS e JavaScript puros** (sem frameworks)
- Sem backend
- Persistir dados com `localStorage` (offline-first)
- Preferir código modular e legível (evitar variáveis globais)

## Princípios de UX

- Layout minimalista, elegante e consistente
- Hierarquia clara (cards, métricas, gráficos se necessário)
- O básico de acessibilidade (contraste, navegação por teclado, tamanhos legíveis)

## Princípios de Dados

- Todos os lançamentos devem estar associados a um **mês/ano**
- Parcelamentos são expandidos em entradas de mês ao salvar
- Cálculos devem ser determinísticos e fáceis de auditar
