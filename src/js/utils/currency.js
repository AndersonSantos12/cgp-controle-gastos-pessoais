/**
 * Utilitários de moeda para manipulação de valores em centavos
 * Evita problemas de ponto flutuante trabalhando com inteiros
 */

/**
 * Converte valor em reais (decimal) para centavos (inteiro)
 * @param {number} value - Valor em reais (ex: 10.50)
 * @returns {number} Valor em centavos (ex: 1050)
 */
export function realToCents(value) {
  return Math.round(value * 100);
}

/**
 * Converte centavos (inteiro) para reais (decimal)
 * @param {number} cents - Valor em centavos (ex: 1050)
 * @returns {number} Valor em reais (ex: 10.50)
 */
export function centsToReal(cents) {
  return cents / 100;
}

/**
 * Formata centavos como string de moeda brasileira (R$ X,XX)
 * @param {number} cents - Valor em centavos
 * @returns {string} String formatada
 */
export function formatCurrency(cents) {
  const real = centsToReal(cents);
  return `R$ ${real.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Soma múltiplos valores em centavos de forma segura
 * @param {number[]} values - Array de valores em centavos
 * @returns {number} Soma em centavos
 */
export function sumCents(values) {
  return values.reduce((acc, val) => acc + (val || 0), 0);
}
