/**
 * Agregação mensal e cálculos
 * Lógica de negócio principal para métricas financeiras
 */

import { sumCents } from '../utils/currency.js';
import { getPreviousMonthKey } from '../utils/dates.js';

/**
 * Obtém todos os gastos de um mês específico
 * @param {Array} expenses - Array de todos os gastos
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {Array} Gastos filtrados daquele mês
 */
export function getExpensesByMonth(expenses, monthKey) {
  return expenses.filter((e) => e.monthKey === monthKey);
}

/**
 * Obtém todas as rendas de um mês específico
 * @param {Array} incomes - Array de todas as rendas
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {Array} Rendas filtradas daquele mês
 */
export function getIncomesByMonth(incomes, monthKey) {
  return incomes.filter((i) => i.monthKey === monthKey);
}

/**
 * Calcula o total de gastos de um mês
 * @param {Array} expenses - Array de todos os gastos
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {number} Total em centavos
 */
export function calculateTotalExpenses(expenses, monthKey) {
  const monthExpenses = getExpensesByMonth(expenses, monthKey);
  return sumCents(monthExpenses.map((e) => e.amount));
}

/**
 * Calcula o total de rendas de um mês
 * @param {Array} incomes - Array de todas as rendas
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {number} Total em centavos
 */
export function calculateTotalIncome(incomes, monthKey) {
  const monthIncomes = getIncomesByMonth(incomes, monthKey);
  return sumCents(monthIncomes.map((i) => i.amount));
}

/**
 * Calcula o total de poupança de um mês
 * @param {Object} allocation - Alocação do mês
 * @returns {number} Valor da poupança em centavos
 */
export function calculateTotalSavings(allocation) {
  return allocation?.savingsAmount || 0;
}

/**
 * Calcula o total de gastos com lazer
 * @param {Array} expenses - Array de todos os gastos
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {number} Total de gastos com lazer em centavos
 */
export function calculateLeisureExpenses(expenses, monthKey) {
  const monthExpenses = getExpensesByMonth(expenses, monthKey);
  const leisureExpenses = monthExpenses.filter((e) => e.isLeisure === true);
  return sumCents(leisureExpenses.map((e) => e.amount));
}

/**
 * Calcula o saldo e status da reserva de lazer
 * @param {Object} allocation - Alocação do mês
 * @param {number} leisureSpent - Total gasto com lazer em centavos
 * @returns {Object} { balance, status, leisureReserve, leisureSpent }
 */
export function calculateLeisureReserveStatus(allocation, leisureSpent) {
  const leisureReserve = allocation?.leisureReserveAmount || 0;
  const balance = leisureReserve - leisureSpent;

  return {
    leisureReserve,
    leisureSpent,
    balance,
    status: balance >= 0 ? 'available' : 'negative',
  };
}

/**
 * Obtém métricas de comparação entre dois meses
 * @param {number} currentValue - Valor do mês atual
 * @param {number} previousValue - Valor do mês anterior
 * @returns {Object} { difference, percentChange }
 */
export function getMonthComparison(currentValue, previousValue) {
  const difference = currentValue - previousValue;
  const percentChange =
    previousValue === 0
      ? 0
      : Math.round((difference / previousValue) * 100);

  return {
    difference,
    percentChange,
    isHigher: difference > 0,
  };
}

/**
 * Calcula métricas completas do dashboard mensal
 * @param {Object} state - Estado da aplicação
 * @param {string} monthKey - Mês alvo (YYYY-MM)
 * @returns {Object} Objeto completo de métricas
 */
export function getMonthlyMetrics(state, monthKey) {
  const previousMonthKey = getPreviousMonthKey(monthKey);

  // Mês atual
  const currentExpenses = calculateTotalExpenses(state.expenses, monthKey);
  const currentIncome = calculateTotalIncome(state.incomes, monthKey);
  const currentSavings = calculateTotalSavings(
    state.allocations[monthKey]
  );
  const currentAllocation = state.allocations[monthKey] || {};
  const currentLeisureSpent = calculateLeisureExpenses(state.expenses, monthKey);
  const currentLeisureStatus = calculateLeisureReserveStatus(
    currentAllocation,
    currentLeisureSpent
  );

  // Mês anterior
  const previousExpenses = calculateTotalExpenses(state.expenses, previousMonthKey);
  const previousIncome = calculateTotalIncome(state.incomes, previousMonthKey);
  const previousSavings = calculateTotalSavings(
    state.allocations[previousMonthKey]
  );

  return {
    monthKey,
    previousMonthKey,
    expenses: {
      total: currentExpenses,
      comparison: getMonthComparison(currentExpenses, previousExpenses),
    },
    income: {
      total: currentIncome,
      comparison: getMonthComparison(currentIncome, previousIncome),
    },
    savings: {
      total: currentSavings,
      comparison: getMonthComparison(currentSavings, previousSavings),
    },
    leisure: currentLeisureStatus,
  };
}
