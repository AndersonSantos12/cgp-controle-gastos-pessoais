# Architecture — Controle de Gastos Pessoais (Frontend-only)

## Overview

This project is a frontend-only system to manage personal finances locally using HTML, CSS and JavaScript.

## Modules (Suggested)

- UI pages: dashboard, expenses, income, savings/reserve, settings
- Storage: localStorage wrapper
- Domain: calculation and normalization (monthly aggregation, installment expansion)
- Charts/metrics: dashboard rendering

## Data Model (localStorage)

Use a single root key, e.g. `cgp:data:v1`.

### Entities

- Expense

  - id, date (YYYY-MM-DD), monthKey (YYYY-MM)
  - kind: fixed | variable | credit_one_time | credit_installments
  - paymentMethod (only for variable): debit | cash | pix
  - description
  - amount (number, in cents recommended)
  - category (optional)
  - installments (optional): totalInstallments, installmentIndex, groupId

- Income

  - id, date, monthKey
  - type: monthly | extra
  - description
  - amount

- Allocation (Deductions)
  - monthKey
  - savingsAmount (poupança)
  - leisureReserveAmount (reserva-lazer)

## Installment Logic (Critical)

When saving a credit installment purchase:

- Create a groupId for the purchase.
- Expand into N monthly entries:
  - monthKey increments month-by-month
  - each entry stores installmentIndex and totalInstallments
- Each installment affects the totals of its monthKey.

## Monthly Aggregation Rules

For a given monthKey:

- totalExpenses = sum(all expenses in monthKey)
- totalIncome = sum(all incomes in monthKey)
- totalSavings = allocation.savingsAmount (or 0)
- leisureReserve = allocation.leisureReserveAmount (or 0)
- leisureSpent = sum(expenses tagged as leisure OR a dedicated "leisure" expense group, depending on UI)
- leisureStatus:
  - available if (leisureReserve - leisureSpent) >= 0
  - negative if (leisureReserve - leisureSpent) < 0
  - leisureBalance = leisureReserve - leisureSpent

## Dashboard Indicators

- Expenses:
  - totalExpenses
  - comparison: (currentMonth - previousMonth) and percent change
- Savings:
  - totalSavings
  - comparison (vs previous month)
- Leisure Reserve:
  - status: available/negative
  - balance: leisureBalance

## Non-goals

- No backend, no external auth, no payments integration.
- Not a banking-grade security product.
