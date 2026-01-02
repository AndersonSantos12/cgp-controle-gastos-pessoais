/**
 * Gerador de dados de teste para desenvolvimento
 * Execute isso no console do navegador ou importe para popular dados de teste
 */

import { addExpense, addIncome, setAllocation } from './storage/store.js';
import { realToCents } from './utils/currency.js';
import { formatMonthKey } from './utils/dates.js';

/**
 * Gera dados de exemplo para testes
 */
export function generateTestData() {
  const today = new Date();
  const currentMonth = formatMonthKey(today);

  // Mês anterior
  const prevDate = new Date(today);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const previousMonth = formatMonthKey(prevDate);

  console.log('🔄 Generating test data for months:', previousMonth, currentMonth);

  // ===== GASTOS - MÊS ANTERIOR =====
  addExpense({
    date: '2025-12-01',
    monthKey: previousMonth,
    kind: 'fixed',
    description: 'Internet',
    amount: realToCents(99.90),
  });

  addExpense({
    date: '2025-12-05',
    monthKey: previousMonth,
    kind: 'variable',
    description: 'Supermercado',
    amount: realToCents(150.00),
    paymentMethod: 'debit',
  });

  addExpense({
    date: '2025-12-10',
    monthKey: previousMonth,
    kind: 'credit_one_time',
    description: 'Compras de Natal',
    amount: realToCents(500.00),
  });

  addExpense({
    date: '2025-12-15',
    monthKey: previousMonth,
    kind: 'variable',
    description: 'Cinema',
    amount: realToCents(60.00),
    paymentMethod: 'pix',
    isLeisure: true,
  });

  // ===== RENDAS - MÊS ANTERIOR =====
  addIncome({
    date: '2025-12-01',
    monthKey: previousMonth,
    type: 'monthly',
    description: 'Salário',
    amount: realToCents(3500.00),
  });

  // ===== ALOCAÇÕES - MÊS ANTERIOR =====
  setAllocation(previousMonth, {
    savingsAmount: realToCents(500.00),
    leisureReserveAmount: realToCents(200.00),
  });

  // ===== GASTOS - MÊS ATUAL =====
  addExpense({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    kind: 'fixed',
    description: 'Internet',
    amount: realToCents(99.90),
  });

  addExpense({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    kind: 'variable',
    description: 'Café',
    amount: realToCents(25.50),
    paymentMethod: 'cash',
  });

  addExpense({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    kind: 'variable',
    description: 'Almoço',
    amount: realToCents(45.00),
    paymentMethod: 'pix',
  });

  addExpense({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    kind: 'variable',
    description: 'Lanches lazer',
    amount: realToCents(35.00),
    paymentMethod: 'debit',
    isLeisure: true,
  });

  // ===== RENDAS - MÊS ATUAL =====
  addIncome({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    type: 'monthly',
    description: 'Salário',
    amount: realToCents(3500.00),
  });

  addIncome({
    date: today.toISOString().split('T')[0],
    monthKey: currentMonth,
    type: 'extra',
    description: 'Freelance',
    amount: realToCents(500.00),
  });

  // ===== ALOCAÇÕES - MÊS ATUAL =====
  setAllocation(currentMonth, {
    savingsAmount: realToCents(600.00),
    leisureReserveAmount: realToCents(250.00),
  });

  console.log('✓ Test data generated successfully!');
  console.log('📊 Open index.html and navigate to see the data');
}

// Exporta para uso
if (typeof window !== 'undefined') {
  window.generateTestData = generateTestData;
}
