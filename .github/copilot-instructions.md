# Copilot Instructions — Controle de Gastos Pessoais

You are assisting a frontend-only personal finance project.

## Hard Rules

- Use ONLY vanilla HTML, CSS and JavaScript (no frameworks, no bundlers).
- Do NOT introduce backend/APIs.
- Persist data with localStorage.

## Feature Rules

- Support:
  - fixed expenses
  - variable expenses with payment methods: debit, cash, pix
  - credit purchases (one-time and installments)
  - monthly income + extra income
  - savings (poupança) deduction
  - leisure reserve (reserva-lazer) deduction with available/negative status
- Installments MUST propagate into subsequent months.

## Dashboard Rules

- Provide a month selector (YYYY-MM).
- Show totals and comparisons vs previous month for:
  - expenses
  - savings
- Show leisure reserve status:
  - available or negative
  - show the balance (reserve - leisureSpent)

## Code Style

- Prefer small modules/files and pure functions for calculations.
- Avoid globals; use a single state object if needed.
- Use cents for currency calculations (avoid floating-point issues).
- Use clear naming in English for variables and functions.
