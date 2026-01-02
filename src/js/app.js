/**
 * Ponto de entrada principal da aplicação
 */

import { renderDashboard, setupMonthNavigation } from './ui/dashboard.js';

/**
 * Inicializa a aplicação
 */
function init() {
  console.log('CGP - Controle de Gastos Pessoais - Inicializando...');

  // Renderiza o dashboard ao carregar
  renderDashboard();
  setupMonthNavigation();

  console.log('✓ Aplicação inicializada com sucesso');
}

// Inicia a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
