/**
 * Utilitários de notificação toast
 */

/**
 * Exibe uma notificação toast na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'info' (padrão: 'info')
 * @param {number} duration - Duração em ms (padrão: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Cria container se não existir
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  // Cria elemento toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    margin-bottom: 10px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    word-wrap: break-word;
  `;

  // Define cores conforme o tipo
  const colors = {
    success: { bg: '#10b981', text: '#ffffff' },
    error: { bg: '#ef4444', text: '#ffffff' },
    info: { bg: '#3b82f6', text: '#ffffff' },
  };

  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Remove após duração
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 300);
  }, duration);
}

// Adiciona animações CSS
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
