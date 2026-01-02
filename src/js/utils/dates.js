/**
 * Utilitários de data para manipulação de mês/ano
 */

/**
 * Converte uma chave de mês (YYYY-MM) para objeto Date
 * @param {string} monthKey - Chave de mês no formato YYYY-MM
 * @returns {Date} Objeto Date para o primeiro dia daquele mês
 */
export function parseMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Formata uma data para chave de mês (YYYY-MM)
 * @param {Date} date - Objeto Date
 * @returns {string} Chave de mês no formato YYYY-MM
 */
export function formatMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Formata uma data para YYYY-MM-DD
 * @param {Date} date - Objeto Date
 * @returns {string} String de data no formato YYYY-MM-DD
 */
export function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtém a chave do mês anterior
 * @param {string} monthKey - Chave do mês atual (YYYY-MM)
 * @returns {string} Chave do mês anterior
 */
export function getPreviousMonthKey(monthKey) {
  const date = parseMonthKey(monthKey);
  date.setMonth(date.getMonth() - 1);
  return formatMonthKey(date);
}

/**
 * Obtém a chave do próximo mês
 * @param {string} monthKey - Chave do mês atual (YYYY-MM)
 * @returns {string} Chave do próximo mês
 */
export function getNextMonthKey(monthKey) {
  const date = parseMonthKey(monthKey);
  date.setMonth(date.getMonth() + 1);
  return formatMonthKey(date);
}

/**
 * Obtém a chave do mês atual
 * @returns {string} Mês atual no formato YYYY-MM
 */
export function getCurrentMonthKey() {
  return formatMonthKey(new Date());
}

/**
 * Adiciona meses a uma chave de mês
 * @param {string} monthKey - Chave de mês (YYYY-MM)
 * @param {number} monthsToAdd - Número de meses a adicionar
 * @returns {string} Nova chave de mês
 */
export function addMonthsToKey(monthKey, monthsToAdd) {
  const date = parseMonthKey(monthKey);
  date.setMonth(date.getMonth() + monthsToAdd);
  return formatMonthKey(date);
}
