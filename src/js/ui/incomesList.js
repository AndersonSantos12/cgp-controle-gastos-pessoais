/**
 * Gerenciamento da lista de rendas para a página income.html
 */

import { getState } from '../storage/store.js';
import { formatCurrency } from '../utils/currency.js';
import { showIncomeEditModal, setEditCallback } from './editModal.js';
import { deleteIncome } from '../storage/store.js';

/**
 * Renderiza lista paginada de rendas para um mês específico ou todos
 */
export function renderIncomesPage(monthKey = null) {
  const state = getState();
  const container = document.getElementById('allIncomesList');
  if (!container) return;

  let incomes = state.incomes;

  // Filtra por mês se fornecido
  if (monthKey) {
    incomes = incomes.filter((i) => i.monthKey === monthKey);
  }

  // Ordena por data decrescente
  incomes = incomes.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (incomes.length === 0) {
    container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Nenhuma renda registrada</p>';
    return;
  }

  const rows = incomes
    .map(
      (i) => `
    <tr>
      <td style="padding: var(--spacing-md);">${i.date}</td>
      <td style="padding: var(--spacing-md);">${i.description}</td>
      <td style="padding: var(--spacing-md);">${i.monthKey}</td>
      <td style="padding: var(--spacing-md);">${i.type}</td>
      <td style="padding: var(--spacing-md); text-align: right; font-weight: 600;">${formatCurrency(i.amount)}</td>
      <td style="padding: var(--spacing-md); text-align: center;">
        <button class="btn btn-small btn-secondary edit-income-btn" data-income-id="${i.id}" style="margin-right: 0.25rem;">
          ✏️
        </button>
        <button class="btn btn-small btn-danger delete-income-btn" data-income-id="${i.id}">
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
  setupIncomeListeners();
}

/**
 * Configura event listeners para a lista de rendas
 */
function setupIncomeListeners() {
  // Botões de edição
  document.querySelectorAll('.edit-income-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const incomeId = btn.dataset.incomeId;
      showIncomeEditModal(incomeId, () => {
        renderIncomesPage();
      });
    });
  });

  // Botões de exclusão
  document.querySelectorAll('.delete-income-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const incomeId = btn.dataset.incomeId;
      if (confirm('Tem certeza que deseja deletar esta renda?')) {
        deleteIncome(incomeId);
        renderIncomesPage();
      }
    });
  });

  // Define callback de atualização
  setEditCallback(() => renderIncomesPage());
}

/**
 * Configura filtros de rendas
 */
export function setupIncomeFilters() {
  const monthFilter = document.getElementById('monthFilter');
  const typeFilter = document.getElementById('typeFilter');

  if (!monthFilter && !typeFilter) return;

  const applyFilters = () => {
    const state = getState();
    let incomes = state.incomes;

    // Aplica filtros
    if (monthFilter && monthFilter.value) {
      incomes = incomes.filter((i) => i.monthKey === monthFilter.value);
    }

    if (typeFilter && typeFilter.value) {
      incomes = incomes.filter((i) => i.type === typeFilter.value);
    }

    // Ordena por data decrescente
    incomes = incomes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Renderiza resultados filtrados
    const container = document.getElementById('allIncomesList');
    if (incomes.length === 0) {
      container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">Nenhuma renda encontrada</p>';
      return;
    }

    const rows = incomes
      .map(
        (i) => `
      <tr>
        <td style="padding: var(--spacing-md);">${i.date}</td>
        <td style="padding: var(--spacing-md);">${i.description}</td>
        <td style="padding: var(--spacing-md);">${i.monthKey}</td>
        <td style="padding: var(--spacing-md);">${i.type}</td>
        <td style="padding: var(--spacing-md); text-align: right; font-weight: 600;">${formatCurrency(i.amount)}</td>
        <td style="padding: var(--spacing-md); text-align: center;">
          <button class="btn btn-small btn-secondary edit-income-btn" data-income-id="${i.id}" style="margin-right: 0.25rem;">
            ✏️
          </button>
          <button class="btn btn-small btn-danger delete-income-btn" data-income-id="${i.id}">
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
            <th style="text-align: right; padding: var(--spacing-md);">Valor</th>
            <th style="text-align: center; padding: var(--spacing-md);">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    setupIncomeListeners();
  };

  // Anexa event listeners
  if (monthFilter) monthFilter.addEventListener('change', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);
}
