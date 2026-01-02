/**
 * Manipulação e validação do formulário de alocações
 */

import { setAllocation, getAllocation, getState } from '../storage/store.js';
import { realToCents, centsToReal, formatCurrency } from '../utils/currency.js';import { showToast } from '../utils/toast.js';import { getCurrentMonthKey } from '../utils/dates.js';
import { calculateLeisureExpenses } from '../domain/calculations.js';

let currentMonthKey = getCurrentMonthKey();

/**
 * Inicializa o formulário de alocações
 */
export function setupAllocationForm() {
  const form = document.getElementById('allocationForm');
  if (!form) return;

  // Configura seletores de mês e ano
  const monthSelect = document.getElementById('allocationMonthSelect');
  const yearSelect = document.getElementById('allocationYearSelect');
  
  if (monthSelect && yearSelect) {
    // Popula os seletores
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

  // Carrega alocação inicial
  loadAllocationForMonth();

  // Manipula envio do formulário
  form.addEventListener('submit', handleAllocationSubmit);
}

/**
 * Atualiza mês atual a partir dos seletores
 */
function updateCurrentMonth(monthSelect, yearSelect) {
  const month = monthSelect.value;
  const year = yearSelect.value;
  currentMonthKey = `${year}-${month}`;
  loadAllocationForMonth();
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
 * Carrega dados de alocação para o mês atual
 */
function loadAllocationForMonth() {
  const monthInput = document.getElementById('allocationMonthInput');
  const allocation = getAllocation(currentMonthKey);

  const savingsInput = document.getElementById('savingsAmount');
  const leisureInput = document.getElementById('leisureReserveAmount');
  const leisureSpentDisplay = document.getElementById('leisureSpentDisplay');
  const leisureStatusDisplay = document.getElementById('leisureStatusDisplay');

  // Carrega valores
  if (savingsInput) {
    savingsInput.value = allocation.savingsAmount ? centsToReal(allocation.savingsAmount) : '';
  }

  if (leisureInput) {
    leisureInput.value = allocation.leisureReserveAmount
      ? centsToReal(allocation.leisureReserveAmount)
      : '';
  }

  // Atualiza exibição do mês
  const monthDisplay = document.getElementById('allocationMonthDisplay');
  if (monthDisplay) {
    monthDisplay.textContent = formatMonthDisplay(currentMonthKey);
  }

  // Calcula e exibe lazer gasto
  if (leisureSpentDisplay) {
    const state = getState();
    const leisureSpent = calculateLeisureExpenses(state.expenses, currentMonthKey);
    const leisureReserve = allocation.leisureReserveAmount || 0;
    const balance = leisureReserve - leisureSpent;

    leisureSpentDisplay.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: var(--spacing-sm);">
            Lazer Gasto
          </div>
          <div style="font-size: 1.5rem; font-weight: 700;">
            ${formatCurrency(leisureSpent)}
          </div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: var(--spacing-sm);">
            Saldo
          </div>
          <div style="font-size: 1.5rem; font-weight: 700; color: ${balance >= 0 ? '#10b981' : '#ef4444'};">
            ${formatCurrency(balance)}
          </div>
        </div>
      </div>
    `;
  }

  // Atualiza status de lazer
  if (leisureStatusDisplay) {
    const state = getState();
    const leisureSpent = calculateLeisureExpenses(state.expenses, currentMonthKey);
    const leisureReserve = allocation.leisureReserveAmount || 0;
    const balance = leisureReserve - leisureSpent;
    const status = balance >= 0 ? 'available' : 'negative';
    const statusText = status === 'available' ? 'Disponível' : 'Negativa';
    const statusClass = status === 'available' ? 'badge-available' : 'badge-negative';

    leisureStatusDisplay.innerHTML = `
      <span class="badge ${statusClass}">
        Status: ${statusText}
      </span>
    `;
  }
}

/**
 * Manipula envio do formulário de alocação
 */
async function handleAllocationSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const savingsReal = parseFloat(formData.get('savingsAmount') || 0);
    const leisureReal = parseFloat(formData.get('leisureReserveAmount') || 0);

    const savingsAmount = realToCents(savingsReal);
    const leisureReserveAmount = realToCents(leisureReal);

    // Valida
    if (savingsAmount < 0 || leisureReserveAmount < 0) {
      showToast('Valores não podem ser negativos', 'error');
      return;
    }

    // Salva alocação
    setAllocation(currentMonthKey, {
      savingsAmount,
      leisureReserveAmount,
    });

    showToast('✓ Alocações salvas com sucesso!', 'success');

    // Recarrega exibição
    loadAllocationForMonth();
  } catch (error) {
    console.error('Erro ao salvar alocação:', error);
    showToast('Erro ao salvar alocações: ' + error.message, 'error');
  }
}

/**
 * Configura navegação de mês para alocações
 */
export function setupAllocationNavigation() {
  const prevBtn = document.getElementById('prevAllocationMonth');
  const nextBtn = document.getElementById('nextAllocationMonth');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const date = new Date(currentMonthKey + '-01');
      date.setMonth(date.getMonth() - 1);
      currentMonthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      const monthInput = document.getElementById('allocationMonthInput');
      if (monthInput) monthInput.value = currentMonthKey;
      loadAllocationForMonth();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const date = new Date(currentMonthKey + '-01');
      date.setMonth(date.getMonth() + 1);
      currentMonthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      const monthInput = document.getElementById('allocationMonthInput');
      if (monthInput) monthInput.value = currentMonthKey;
      loadAllocationForMonth();
    });
  }
}

/**
 * Formata chave de mês para exibição
 */
function formatMonthDisplay(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
