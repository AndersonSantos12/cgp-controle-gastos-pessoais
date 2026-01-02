/**
 * Gerenciamento da lista de gastos para a página expense.html
 */

import { getState } from '../storage/store.js';
import { formatCurrency } from '../utils/currency.js';
import { showExpenseEditModal, setEditCallback } from './editModal.js';
import { deleteExpense } from '../storage/store.js';

/**
 * Renderiza lista paginada de gastos para um mês específico ou todos
 */
export function renderExpensesPage(monthKey = null) {
  const state = getState();
  const container = document.getElementById('allExpensesList');
  if (!container) return;

  let expenses = state.expenses;

  // Filtra por mês se fornecido
  if (monthKey) {
    expenses = expenses.filter((e) => e.monthKey === monthKey);
  }

  // Ordena por data decrescente
  expenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (expenses.length === 0) {
    container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Nenhum gasto registrado</p>';
    return;
  }

  const rows = expenses
    .map(
      (e) => `
    <tr>
      <td style="padding: var(--spacing-md);">${e.date}</td>
      <td style="padding: var(--spacing-md);">${e.description}</td>
      <td style="padding: var(--spacing-md);">${e.monthKey}</td>
      <td style="padding: var(--spacing-md);">${e.kind}</td>
      <td style="padding: var(--spacing-md);">${e.paymentMethod || '-'}</td>
      <td style="padding: var(--spacing-md); text-align: right; font-weight: 600;">${formatCurrency(e.amount)}</td>
      <td style="padding: var(--spacing-md); text-align: center;">
        <button class="btn btn-small btn-secondary edit-expense-btn" data-expense-id="${e.id}" style="margin-right: 0.25rem;">
          ✏️
        </button>
        <button class="btn btn-small btn-danger delete-expense-btn" data-expense-id="${e.id}">
          🗑️
        </button>
      </td>
    </tr>
  `
    )
    .join('');

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid var(--gray-200); background: var(--gray-50);">
          <th style="text-align: left; padding: var(--spacing-md);">Data</th>
          <th style="text-align: left; padding: var(--spacing-md);">Descrição</th>
          <th style="text-align: left; padding: var(--spacing-md);">Mês</th>
          <th style="text-align: left; padding: var(--spacing-md);">Tipo</th>
          <th style="text-align: left; padding: var(--spacing-md);">Pagamento</th>
          <th style="text-align: right; padding: var(--spacing-md);">Valor</th>
          <th style="text-align: center; padding: var(--spacing-md);">Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  // Configura event listeners
  setupExpenseListeners();
}

/**
 * Configura event listeners para a lista de gastos
 */
function setupExpenseListeners() {
  // Botões de edição
  document.querySelectorAll('.edit-expense-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expenseId = btn.dataset.expenseId;
      showExpenseEditModal(expenseId, () => {
        renderExpensesPage();
      });
    });
  });

  // Botões de exclusão
  document.querySelectorAll('.delete-expense-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expenseId = btn.dataset.expenseId;
      if (confirm('Tem certeza que deseja deletar este gasto?')) {
        deleteExpense(expenseId);
        renderExpensesPage();
      }
    });
  });

  // Define callback de atualização
  setEditCallback(() => renderExpensesPage());
}

/**
 * Configura filtros de gastos
 */
export function setupExpenseFilters() {
  const monthFilter = document.getElementById('monthFilter');
  const kindFilter = document.getElementById('kindFilter');
  const categoryFilter = document.getElementById('categoryFilter');

  if (!monthFilter && !kindFilter && !categoryFilter) return;

  const applyFilters = () => {
    const state = getState();
    let expenses = state.expenses;

    // Aplica filtros
    if (monthFilter && monthFilter.value) {
      expenses = expenses.filter((e) => e.monthKey === monthFilter.value);
    }

    if (kindFilter && kindFilter.value) {
      expenses = expenses.filter((e) => e.kind === kindFilter.value);
    }

    if (categoryFilter && categoryFilter.value) {
      expenses = expenses.filter((e) => e.category === categoryFilter.value);
    }

    // Ordena por data decrescente
    expenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Renderiza resultados filtrados
    const container = document.getElementById('allExpensesList');
    if (expenses.length === 0) {
      container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Nenhum gasto encontrado</p>';
      return;
    }

    const rows = expenses
      .map(
        (e) => `
      <tr>
        <td style="padding: var(--spacing-md);">${e.date}</td>
        <td style="padding: var(--spacing-md);">${e.description}</td>
        <td style="padding: var(--spacing-md);">${e.monthKey}</td>
        <td style="padding: var(--spacing-md);">${e.kind}</td>
        <td style="padding: var(--spacing-md);">${e.paymentMethod || '-'}</td>
        <td style="padding: var(--spacing-md); text-align: right; font-weight: 600;">${formatCurrency(e.amount)}</td>
        <td style="padding: var(--spacing-md); text-align: center;">
          <button class="btn btn-small btn-secondary edit-expense-btn" data-expense-id="${e.id}" style="margin-right: 0.25rem;">
            ✏️
          </button>
          <button class="btn btn-small btn-danger delete-expense-btn" data-expense-id="${e.id}">
            🗑️
          </button>
        </td>
      </tr>
    `
      )
      .join('');

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid var(--gray-200); background: var(--gray-50);">
            <th style="text-align: left; padding: var(--spacing-md);">Data</th>
            <th style="text-align: left; padding: var(--spacing-md);">Descrição</th>
            <th style="text-align: left; padding: var(--spacing-md);">Mês</th>
            <th style="text-align: left; padding: var(--spacing-md);">Tipo</th>
            <th style="text-align: left; padding: var(--spacing-md);">Pagamento</th>
            <th style="text-align: right; padding: var(--spacing-md);">Valor</th>
            <th style="text-align: center; padding: var(--spacing-md);">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    setupExpenseListeners();
  };

  // Anexa event listeners
  if (monthFilter) monthFilter.addEventListener('change', applyFilters);
  if (kindFilter) kindFilter.addEventListener('change', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
}
