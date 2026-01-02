# Controle de Gastos Pessoais (Frontend-only)

Sistema de controle de gastos pessoais com foco em **UX elegante** e **dashboard mensal**.

## Funcionalidades

- Cadastro de **gastos fixos** (assinaturas, internet, etc.)
- Cadastro de **gastos variáveis** por forma de pagamento: **débito, dinheiro, pix**
- Cadastro de **compras no crédito**:
  - crédito à vista
  - crédito parcelado (lançamento automático nos meses seguintes)
- Cadastro de **renda mensal** e **renda extra**
- Registro de subtrações/“alocações” mensais para:
  - **poupança (economias)**
  - **reserva-lazer** (status disponível/negativo)

## Dashboard

- Seleção do mês (YYYY-MM)
- Indicadores:
  - Gastos mensais (total + comparativo com mês anterior)
  - Economias/poupança (total + comparativo com mês anterior)
  - Reserva-lazer (saldo e status: disponível/negativo)

## Tecnologias

- HTML5, CSS3, JavaScript (ES6+)
- Persistência local com `localStorage`

## Observações

Projeto educacional e local (offline-first). Não há backend.
