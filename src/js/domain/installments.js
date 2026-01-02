/**
 * Lógica de parcelamento para compras no crédito
 * Expande uma compra parcelada em múltiplas entradas mensais
 */

import { addMonthsToKey } from '../utils/dates.js';

/**
 * Cria entradas de parcelas para uma compra no crédito
 * @param {Object} purchase - Objeto base da compra
 * @param {number} totalInstallments - Número de parcelas
 * @param {string} startMonthKey - Mês inicial (YYYY-MM)
 * @returns {Array} Array de entradas de gastos expandidas
 */
export function expandInstallments(purchase, totalInstallments, startMonthKey) {
  if (totalInstallments <= 0) {
    throw new Error('O total de parcelas deve ser maior que 0');
  }

  const groupId = generateGroupId();
  const installmentAmount = Math.round(purchase.amount / totalInstallments);
  const entries = [];

  for (let i = 0; i < totalInstallments; i++) {
    const monthKey = addMonthsToKey(startMonthKey, i);
    entries.push({
      ...purchase,
      monthKey,
      installments: {
        groupId,
        installmentIndex: i + 1,
        totalInstallments,
      },
      amount: installmentAmount,
    });
  }

  // Ajusta a última parcela para compensar arredondamento
  const totalDistributed = installmentAmount * totalInstallments;
  if (totalDistributed !== purchase.amount) {
    entries[totalInstallments - 1].amount += purchase.amount - totalDistributed;
  }

  return entries;
}

/**
 * Obtém todas as parcelas de um grupo específico
 * @param {Array} expenses - Array de todos os gastos
 * @param {string} groupId - ID do grupo de parcelas
 * @returns {Array} Gastos filtrados
 */
export function getInstallmentsByGroup(expenses, groupId) {
  return expenses.filter(
    (e) => e.installments && e.installments.groupId === groupId
  );
}

/**
 * Gera um ID único de grupo para rastreamento de parcelas
 * @returns {string} ID do grupo
 */
function generateGroupId() {
  return `grp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
