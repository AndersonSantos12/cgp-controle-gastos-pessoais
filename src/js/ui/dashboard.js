/**
 * Lógica de renderização e interação do dashboard
 */

import { getState } from '../storage/store.js';
import { getMonthlyMetrics } from '../domain/calculations.js';
import { formatCurrency } from '../utils/currency.js';
import { getCurrentMonthKey, getNextMonthKey, getPreviousMonthKey } from '../utils/dates.js';
import { showExpenseEditModal, showIncomeEditModal, setEditCallback } from './editModal.js';
import { deleteExpense, deleteIncome } from '../storage/store.js';

let currentMonthKey = getCurrentMonthKey();

/**
 * Renderiza o dashboard com métricas do mês atual
 */
export function renderDashboard() {
  const state = getState();
  const metrics = getMonthlyMetrics(state, currentMonthKey);

  // Define callback de edição antes de renderizar
  setEditCallback(() => renderDashboard());

  updateMonthSelector();
  renderExpensesMetric(metrics);
  renderSavingsMetric(metrics);
  renderIncomeMetric(metrics);
  renderLeisureReserveMetric(metrics);
  renderExpensesList(state, currentMonthKey);
  renderIncomesList(state, currentMonthKey);
}

/**
 * Atualiza seletor e exibição do mês
 */
function updateMonthSelector() {
  const input = document.getElementById('monthInput');
  if (input) {
    input.value = currentMonthKey;
  }

  const display = document.getElementById('monthDisplay');
  if (display) {
    display.textContent = formatMonthDisplay(currentMonthKey);
  }
}

/**
 * Renderiza card de gastos com comparação
 */
function renderExpensesMetric(metrics) {
  const container = document.getElementById('expensesMetric');
  if (!container) return;

  const { total, comparison } = metrics.expenses;
  const isHigher = comparison.isHigher;

  container.innerHTML = `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col justify-between">
      <div class="text-sm text-slate-600 font-medium mb-2">💳 Gastos</div>
      <div class="text-3xl font-bold text-slate-900 mb-3">${formatCurrency(total)}</div>
      <div class="flex items-center gap-2 text-sm ${isHigher ? 'text-red-600' : 'text-green-600'}">
        <span class="font-semibold">${isHigher ? '↑' : '↓'} ${formatCurrency(Math.abs(comparison.difference))}</span>
        <span class="text-xs">(${isHigher ? '+' : ''}${comparison.percentChange}%)</span>
      </div>
    </div>
  `;
}

/**
 * Renderiza card de poupança com comparação
 */
function renderSavingsMetric(metrics) {
  const container = document.getElementById('savingsMetric');
  if (!container) return;

  const { total, comparison } = metrics.savings;
  const isHigher = comparison.difference > 0;

  container.innerHTML = `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col justify-between">
      <div class="text-sm text-slate-600 font-medium mb-2">💰 Poupança</div>
      <div class="text-3xl font-bold text-slate-900 mb-3">${formatCurrency(total)}</div>
      <div class="flex items-center gap-2 text-sm ${isHigher ? 'text-green-600' : 'text-red-600'}">
        <span class="font-semibold">${isHigher ? '↑' : '↓'} ${formatCurrency(Math.abs(comparison.difference))}</span>
        <span class="text-xs">(${isHigher ? '+' : ''}${comparison.percentChange}%)</span>
      </div>
    </div>
  `;
}

/**
 * Renderiza card de renda com comparação
 */
function renderIncomeMetric(metrics) {
  const container = document.getElementById('incomeMetric');
  if (!container) return;

  const { total, comparison } = metrics.income;
  const isHigher = comparison.difference > 0;

  container.innerHTML = `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col justify-between">
      <div class="text-sm text-slate-600 font-medium mb-2">💵 Renda</div>
      <div class="text-3xl font-bold text-slate-900 mb-3">${formatCurrency(total)}</div>
      <div class="flex items-center gap-2 text-sm ${isHigher ? 'text-green-600' : 'text-red-600'}">
        <span class="font-semibold">${isHigher ? '↑' : '↓'} ${formatCurrency(Math.abs(comparison.difference))}</span>
        <span class="text-xs">(${isHigher ? '+' : ''}${comparison.percentChange}%)</span>
      </div>
    </div>
  `;
}

/**
 * Renderiza card de status da reserva de lazer
 */
function renderLeisureReserveMetric(metrics) {
  const container = document.getElementById('leisureMetric');
  if (!container) return;

  const { status, balance, leisureReserve, leisureSpent } = metrics.leisure;
  const isAvailable = status === 'available';

  container.innerHTML = `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col justify-between">
      <div class="text-sm text-slate-600 font-medium mb-2">🎭 Reserva-Lazer</div>
      <div class="space-y-3">
        <div>
          <div class="text-2xl font-bold text-slate-900">${formatCurrency(leisureReserve)}</div>
          <div class="text-xs text-slate-500">Limite / ${formatCurrency(leisureSpent)} gasto</div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-600">Saldo:</span>
          <span class="font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}">
            ${formatCurrency(balance)}
          </span>
        </div>
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            isAvailable
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }">
            ${isAvailable ? '✓ Disponível' : '✗ Negativa'}
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza lista de gastos do mês atual
 */
function renderExpensesList(state, monthKey) {
  const container = document.getElementById('expensesList');
  if (!container) return;

  const expenses = state.expenses.filter((e) => e.monthKey === monthKey);

  if (expenses.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400">Nenhum gasto registrado</div>';
    return;
  }

  const rows = expenses
    .map(
      (e) => `
    <div class="p-4 hover:bg-slate-50 flex items-center justify-between group transition cursor-pointer border-b border-slate-100">
      <div class="flex-1 min-w-0">
        <div class="font-medium text-slate-900">${e.description}</div>
        <div class="text-sm text-slate-500">${e.date} • ${e.kind}</div>
      </div>
      <div class="flex items-center gap-3 ml-4">
        <div class="text-right">
          <div class="font-semibold text-slate-900">${formatCurrency(e.amount)}</div>
          ${e.paymentMethod ? `<div class="text-xs text-slate-500">${e.paymentMethod}</div>` : ''}
        </div>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button class="edit-expense-btn p-2 hover:bg-blue-100 rounded-lg transition text-lg" data-expense-id="${e.id}" title="Editar">
            ✏️
          </button>
          <button class="delete-expense-btn p-2 hover:bg-red-100 rounded-lg transition text-lg" data-expense-id="${e.id}" title="Deletar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  container.innerHTML = rows;

  // Adiciona event listeners para botões de editar/deletar
  container.querySelectorAll('.edit-expense-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expenseId = btn.dataset.expenseId;
      showExpenseEditModal(expenseId, () => renderDashboard());
    });
  });

  container.querySelectorAll('.delete-expense-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expenseId = btn.dataset.expenseId;
      if (confirm('Tem certeza que deseja deletar este gasto?')) {
        deleteExpense(expenseId);
        renderDashboard();
      }
    });
  });
}

/**
 * Renderiza lista de rendas do mês atual
 */
function renderIncomesList(state, monthKey) {
  const container = document.getElementById('incomesList');
  if (!container) return;

  const incomes = state.incomes.filter((i) => i.monthKey === monthKey);

  if (incomes.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400">Nenhuma renda registrada</div>';
    return;
  }

  const rows = incomes
    .map(
      (i) => `
    <div class="p-4 hover:bg-slate-50 flex items-center justify-between group transition cursor-pointer border-b border-slate-100">
      <div class="flex-1 min-w-0">
        <div class="font-medium text-slate-900">${i.description}</div>
        <div class="text-sm text-slate-500">${i.date} • ${i.type === 'monthly' ? 'Mensal' : 'Extra'}</div>
      </div>
      <div class="flex items-center gap-3 ml-4">
        <div class="text-right">
          <div class="font-semibold text-slate-900">${formatCurrency(i.amount)}</div>
        </div>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button class="edit-income-btn p-2 hover:bg-blue-100 rounded-lg transition text-lg" data-income-id="${i.id}" title="Editar">
            ✏️
          </button>
          <button class="delete-income-btn p-2 hover:bg-red-100 rounded-lg transition text-lg" data-income-id="${i.id}" title="Deletar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  container.innerHTML = rows;

  // Adiciona event listeners para botões de editar/deletar
  container.querySelectorAll('.edit-income-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const incomeId = btn.dataset.incomeId;
      showIncomeEditModal(incomeId, () => renderDashboard());
    });
  });

  container.querySelectorAll('.delete-income-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const incomeId = btn.dataset.incomeId;
      if (confirm('Tem certeza que deseja deletar esta renda?')) {
        deleteIncome(incomeId);
        renderDashboard();
      }
    });
  });
}

/**
 * Configura navegação de mês
 */
export function setupMonthNavigation() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonthKey = getPreviousMonthKey(currentMonthKey);
      updateSelects(monthSelect, yearSelect);
      renderDashboard();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonthKey = getNextMonthKey(currentMonthKey);
      updateSelects(monthSelect, yearSelect);
      renderDashboard();
    });
  }

  if (monthSelect && yearSelect) {
    // Popula seletores
    populateMonthSelect(monthSelect);
    populateYearSelect(yearSelect);
    
    // Define valores atuais
    const [year, month] = currentMonthKey.split('-');
    monthSelect.value = month;
    yearSelect.value = year;
    
    // Escuta mudanças
    monthSelect.addEventListener('change', () => updateCurrentMonth(monthSelect, yearSelect));
    yearSelect.addEventListener('change', () => updateCurrentMonth(monthSelect, yearSelect));
  }
}

/**
 * Atualiza mês atual a partir dos seletores
 */
function updateCurrentMonth(monthSelect, yearSelect) {
  const month = monthSelect.value;
  const year = yearSelect.value;
  currentMonthKey = `${year}-${month}`;
  renderDashboard();
}

/**
 * Atualiza valores dos seletores a partir do currentMonthKey
 */
function updateSelects(monthSelect, yearSelect) {
  if (monthSelect && yearSelect) {
    const [year, month] = currentMonthKey.split('-');
    monthSelect.value = month;
    yearSelect.value = year;
  }
}

/**
 * Popula seletor de mês (01-12)
 */
function populateMonthSelect(selectElement) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = String(index + 1).padStart(2, '0');
    option.textContent = month;
    selectElement.appendChild(option);
  });
}

/**
 * Popula seletor de ano com últimos 12 anos + próximos 12 anos
 */
function populateYearSelect(selectElement) {
  const currentYear = new Date().getFullYear();
  
  for (let i = currentYear - 12; i <= currentYear + 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectElement.appendChild(option);
  }
}

/**
 * Formata chave de mês para exibição (ex: "janeiro de 2026")
 */
function formatMonthDisplay(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
