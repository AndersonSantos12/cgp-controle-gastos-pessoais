/**
 * Manipulação e validação do formulário de gastos
 */

import { addExpense } from '../storage/store.js';
import { expandInstallments } from '../domain/installments.js';
import { realToCents, formatCurrency } from '../utils/currency.js';
import { formatMonthKey, getCurrentMonthKey } from '../utils/dates.js';
import { showToast } from '../utils/toast.js';

/**
 * Inicializa o formulário de gastos
 */
export function setupExpenseForm() {
  const form = document.getElementById('expenseForm');
  if (!form) return;

  // Define data padrão como hoje
  const today = new Date();
  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput) {
    dateInput.valueAsDate = today;
  }

  // Manipula mudança de tipo para mostrar/ocultar método de pagamento
  const kindSelect = form.querySelector('select[name="kind"]');
  const paymentMethodGroup = document.getElementById('paymentMethodGroup');
  const installmentsGroup = document.getElementById('installmentsGroup');

  if (kindSelect) {
    kindSelect.addEventListener('change', (e) => {
      const kind = e.target.value;

      // Mostra método de pagamento apenas para gastos variáveis
      if (paymentMethodGroup) {
        paymentMethodGroup.style.display = kind === 'variable' ? 'block' : 'none';
      }

      // Mostra parcelamentos apenas para compras parceladas no crédito
      if (installmentsGroup) {
        installmentsGroup.style.display = kind === 'credit_installments' ? 'block' : 'none';
      }

      // Aciona estado inicial
      if (kind === 'fixed') {
        paymentMethodGroup.style.display = 'none';
        installmentsGroup.style.display = 'none';
      }
    });

    // Aciona ao carregar
    kindSelect.dispatchEvent(new Event('change'));
  }

  // Manipula envio do formulário
  form.addEventListener('submit', handleExpenseSubmit);
}

/**
 * Manipula o envio do formulário de gastos
 */
async function handleExpenseSubmit(e) {
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
    const kind = formData.get('kind');
    const description = formData.get('description');
    const amountReal = parseFloat(formData.get('amount'));
    const amount = realToCents(amountReal);
    const paymentMethod = formData.get('paymentMethod');
    const category = formData.get('category');
    const isLeisure = formData.get('isLeisure') === 'on';

    // Extrai mês da data
    const monthKey = formatMonthKey(new Date(date));

    // Cria objeto de gasto base
    const expense = {
      date,
      monthKey,
      kind,
      description,
      amount,
      paymentMethod: paymentMethod || null,
      category: category || null,
      isLeisure,
    };

    // Manipula parcelamentos
    if (kind === 'credit_installments') {
      const totalInstallments = parseInt(formData.get('totalInstallments') || 1);

      if (totalInstallments < 2) {
        showToast('Parcelamentos devem ter pelo menos 2 parcelas', 'error');
        return;
      }

      const installments = expandInstallments(expense, totalInstallments, monthKey);

      // Adiciona cada parcela
      for (const installment of installments) {
        addExpense(installment);
      }

      const endMonth = new Date(date);
      endMonth.setMonth(endMonth.getMonth() + totalInstallments - 1);

      showToast(
        `✓ Compra parcelada criada!\n${totalInstallments}x ${formatCurrency(amount / totalInstallments)}\nDe ${date} até ${formatMonthKey(endMonth)}`,
        'success'
      );
    } else {
      // Adiciona gasto regular
      addExpense(expense);
      showToast('✓ Gasto registrado com sucesso!', 'success');
    }

    // Reseta formulário
    form.reset();
    const today = new Date();
    form.querySelector('input[name="date"]').valueAsDate = today;
    form.querySelector('select[name="kind"]').dispatchEvent(new Event('change'));
  } catch (error) {
    console.error('Error saving expense:', error);
    showToast('Erro ao salvar gasto: ' + error.message, 'error');
  }
}
