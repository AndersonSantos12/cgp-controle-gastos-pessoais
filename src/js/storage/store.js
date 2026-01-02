/**
 * Wrapper do localStorage para persistência de dados do CGP
 * Fonte única da verdade: cgp:data:v1
 */

const STORAGE_KEY = 'cgp:data:v1';

/**
 * Inicializa estrutura de dados padrão
 */
function getDefaultState() {
  return {
    expenses: [],
    incomes: [],
    allocations: {}, // monthKey -> { savingsAmount, leisureReserveAmount }
  };
}

/**
 * Obtém todos os dados do localStorage
 * @returns {Object} Estado da aplicação
 */
export function getState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultState();
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return getDefaultState();
  }
}

/**
 * Salva todo o estado no localStorage
 * @param {Object} state - Estado da aplicação
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao escrever no localStorage:', error);
    throw new Error('Falha ao salvar dados');
  }
}

/**
 * Adiciona um gasto
 * @param {Object} expense - Objeto de gasto
 * @returns {Object} Estado atualizado
 */
export function addExpense(expense) {
  const state = getState();
  state.expenses.push({
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...expense,
  });
  saveState(state);
  return state;
}

/**
 * Adiciona uma renda
 * @param {Object} income - Objeto de renda
 * @returns {Object} Estado atualizado
 */
export function addIncome(income) {
  const state = getState();
  state.incomes.push({
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...income,
  });
  saveState(state);
  return state;
}

/**
 * Adiciona ou atualiza alocação (poupança/reserva de lazer) para um mês
 * @param {string} monthKey - Chave do mês (YYYY-MM)
 * @param {Object} allocation - { savingsAmount?, leisureReserveAmount? }
 * @returns {Object} Estado atualizado
 */
export function setAllocation(monthKey, allocation) {
  const state = getState();
  state.allocations[monthKey] = {
    ...(state.allocations[monthKey] || {}),
    ...allocation,
  };
  saveState(state);
  return state;
}

/**
 * Obtém alocação de um mês específico
 * @param {string} monthKey - Chave do mês (YYYY-MM)
 * @returns {Object} Objeto de alocação
 */
export function getAllocation(monthKey) {
  const state = getState();
  return state.allocations[monthKey] || {};
}

/**
 * Atualiza um gasto por ID
 * @param {string} expenseId - ID do gasto
 * @param {Object} updates - Campos a atualizar
 * @returns {Object} Estado atualizado
 */
export function updateExpense(expenseId, updates) {
  const state = getState();
  const expense = state.expenses.find((e) => e.id === expenseId);
  if (expense) {
    Object.assign(expense, updates);
    saveState(state);
  }
  return state;
}

/**
 * Deleta um gasto por ID
 * @param {string} expenseId - ID do gasto
 * @returns {Object} Estado atualizado
 */
export function deleteExpense(expenseId) {
  const state = getState();
  state.expenses = state.expenses.filter((e) => e.id !== expenseId);
  saveState(state);
  return state;
}

/**
 * Deleta todas as parcelas de um grupo
 * @param {string} groupId - ID do grupo de parcelas
 * @returns {Object} Estado atualizado
 */
export function deleteInstallmentGroup(groupId) {
  const state = getState();
  state.expenses = state.expenses.filter((e) => {
    return !e.installments || e.installments.groupId !== groupId;
  });
  saveState(state);
  return state;
}

/**
 * Obtém um único gasto por ID
 * @param {string} expenseId - ID do gasto
 * @returns {Object|null} Objeto de gasto ou null
 */
export function getExpenseById(expenseId) {
  const state = getState();
  return state.expenses.find((e) => e.id === expenseId) || null;
}

/**
 * Atualiza uma renda por ID
 * @param {string} incomeId - ID da renda
 * @param {Object} updates - Campos a atualizar
 * @returns {Object} Estado atualizado
 */
export function updateIncome(incomeId, updates) {
  const state = getState();
  const income = state.incomes.find((i) => i.id === incomeId);
  if (income) {
    Object.assign(income, updates);
    saveState(state);
  }
  return state;
}

/**
 * Deleta uma renda por ID
 * @param {string} incomeId - ID da renda
 * @returns {Object} Estado atualizado
 */
export function deleteIncome(incomeId) {
  const state = getState();
  state.incomes = state.incomes.filter((i) => i.id !== incomeId);
  saveState(state);
  return state;
}

/**
 * Obtém uma única renda por ID
 * @param {string} incomeId - ID da renda
 * @returns {Object|null} Objeto de renda ou null
 */
export function getIncomeById(incomeId) {
  const state = getState();
  return state.incomes.find((i) => i.id === incomeId) || null;
}

/**
 * Limpa todos os dados (útil para testes)
 */
export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Gera um ID único
 * @returns {string} Identificador único
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
