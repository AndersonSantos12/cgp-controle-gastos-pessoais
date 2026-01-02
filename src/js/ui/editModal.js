/**
 * Utilitários de modal e edição
 */

import { centsToReal, formatCurrency, realToCents } from '../utils/currency.js';
import {
  updateExpense,
  deleteExpense,
  deleteInstallmentGroup,
  getExpenseById,
  updateIncome,
  deleteIncome,
  getIncomeById,
} from '../storage/store.js';

let onEditCallback = null;

/**
 * Define callback para atualizar UI após edição
 */
export function setEditCallback(callback) {
  onEditCallback = callback;
}

/**
 * Cria e exibe modal de edição de gasto
 */
export function showExpenseEditModal(expenseId, onClose) {
  const expense = getExpenseById(expenseId);
  if (!expense) {
    showToast('Gasto não encontrado', 'error');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';

  const isInstallment = expense.installments;

  modal.innerHTML = `
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-900">Editar Gasto</h2>
      </div>

      ${
        isInstallment
          ? `
        <div class="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p class="text-sm text-amber-900">
            ⚠️ Este é uma parcela de uma compra parcelada.<br/>
            Você pode editar ou deletar apenas essa parcela.
          </p>
        </div>
      `
          : ''
      }

      <form id="editExpenseForm" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Data</label>
          <input type="date" name="date" value="${expense.date}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <input type="text" name="description" value="${expense.description}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
          <input type="number" name="amount" value="${centsToReal(expense.amount)}" step="0.01" min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
          <select name="category" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione uma categoria</option>
            <option value="Alimentação" ${expense.category === 'Alimentação' ? 'selected' : ''}>🍔 Alimentação</option>
            <option value="Transporte" ${expense.category === 'Transporte' ? 'selected' : ''}>🚗 Transporte</option>
            <option value="Saúde" ${expense.category === 'Saúde' ? 'selected' : ''}>🏥 Saúde</option>
            <option value="Educação" ${expense.category === 'Educação' ? 'selected' : ''}>📚 Educação</option>
            <option value="Lazer" ${expense.category === 'Lazer' ? 'selected' : ''}>🎬 Lazer</option>
            <option value="Compras" ${expense.category === 'Compras' ? 'selected' : ''}>🛍️ Compras</option>
            <option value="Moradia" ${expense.category === 'Moradia' ? 'selected' : ''}>🏠 Moradia</option>
            <option value="Utilidades" ${expense.category === 'Utilidades' ? 'selected' : ''}>💡 Utilidades</option>
            <option value="Assinaturas" ${expense.category === 'Assinaturas' ? 'selected' : ''}>📱 Assinaturas</option>
            <option value="Outros" ${expense.category === 'Outros' ? 'selected' : ''}>📦 Outros</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isLeisure" ${expense.isLeisure ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-blue-600" />
            <span class="text-sm font-medium text-slate-700">Classificar como Lazer</span>
          </label>
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            ✓ Salvar
          </button>
          <button type="button" id="cancelBtn" class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition">
            Cancelar
          </button>
          <button type="button" id="deleteBtn" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            🗑️
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle close
  const closeModal = () => {
    modal.remove();
    if (onClose) onClose();
  };

  // Manipula envio do formulário
  const form = modal.querySelector('#editExpenseForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedData = {
      date: form.elements.date.value,
      description: form.elements.description.value,
      amount: realToCents(parseFloat(form.elements.amount.value)),
      category: form.elements.category.value,
      isLeisure: form.elements.isLeisure.checked,
    };

    updateExpense(expenseId, updatedData);
    closeModal();
    if (onEditCallback) onEditCallback();
  });

  // Manipula cancelamento
  modal.querySelector('#cancelBtn').addEventListener('click', closeModal);

  // Manipula deleção
  modal.querySelector('#deleteBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja deletar este gasto?')) {
      if (isInstallment) {
        deleteExpense(expenseId);
      } else {
        deleteInstallmentGroup(expenseId);
      }
      closeModal();
      if (onEditCallback) onEditCallback();
    }
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * Cria e exibe modal de edição de renda
 */
export function showIncomeEditModal(incomeId, onClose) {
  const income = getIncomeById(incomeId);
  if (!income) {
    showToast('Renda não encontrada', 'error');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';

  modal.innerHTML = `
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-900">Editar Renda</h2>
      </div>

      <form id="editIncomeForm" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Data</label>
          <input type="date" name="date" value="${income.date}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select name="type" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="monthly" ${income.type === 'monthly' ? 'selected' : ''}>Renda Mensal</option>
            <option value="extra" ${income.type === 'extra' ? 'selected' : ''}>Renda Extra</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <input type="text" name="description" value="${income.description}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
          <input type="number" name="amount" value="${centsToReal(income.amount)}" step="0.01" min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            ✓ Salvar
          </button>
          <button type="button" id="cancelBtn" class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition">
            Cancelar
          </button>
          <button type="button" id="deleteBtn" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            🗑️
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Manipula fechamento
  const closeModal = () => {
    modal.remove();
    if (onClose) onClose();
  };

  // Manipula envio do formulário
  const form = modal.querySelector('#editIncomeForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedData = {
      date: form.elements.date.value,
      type: form.elements.type.value,
      description: form.elements.description.value,
      amount: realToCents(parseFloat(form.elements.amount.value)),
    };

    updateIncome(incomeId, updatedData);
    closeModal();
    if (onEditCallback) onEditCallback();
  });

  // Manipula cancelamento
  modal.querySelector('#cancelBtn').addEventListener('click', closeModal);

  // Manipula deleção
  modal.querySelector('#deleteBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja deletar esta renda?')) {
      deleteIncome(incomeId);
      closeModal();
      if (onEditCallback) onEditCallback();
    }
  });

  // Fecha modal ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}
