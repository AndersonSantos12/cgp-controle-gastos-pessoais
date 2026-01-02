/**
 * Manipulação e validação do formulário de rendas
 */

import { addIncome } from '../storage/store.js';
import { realToCents } from '../utils/currency.js';
import { formatMonthKey } from '../utils/dates.js';
import { showToast } from '../utils/toast.js';

/**
 * Inicializa o formulário de rendas
 */
export function setupIncomeForm() {
  const form = document.getElementById('incomeForm');
  if (!form) return;

  // Define data padrão como hoje
  const today = new Date();
  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput) {
    dateInput.valueAsDate = today;
  }

  // Manipula envio do formulário
  form.addEventListener('submit', handleIncomeSubmit);
}

/**
 * Manipula o envio do formulário de rendas
 */
async function handleIncomeSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    // Valida campos obrigatórios
    if (!formData.get('date') || !formData.get('description') || !formData.get('amount')) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    const date = formData.get('date');
    const type = formData.get('type');
    const description = formData.get('description');
    const amountReal = parseFloat(formData.get('amount'));
    const amount = realToCents(amountReal);

    // Extrai mês da data
    const monthKey = formatMonthKey(new Date(date));

    // Cria objeto de renda
    const income = {
      date,
      monthKey,
      type,
      description,
      amount,
    };

    // Adiciona renda
    addIncome(income);
    showToast('✓ Renda registrada com sucesso!', 'success');

    // Reseta formulário
    form.reset();
    const today = new Date();
    form.querySelector('input[name="date"]').valueAsDate = today;
  } catch (error) {
    console.error('Error saving income:', error);
    showToast('Erro ao salvar renda: ' + error.message, 'error');
  }
}
