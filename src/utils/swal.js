import Swal from 'sweetalert2';

// Wrapper ligero para SweetAlert2 que aplica por defecto una clase CSS
// (`my-swal-popup`) y, en `didOpen`, copia las variables del tema a custom
// properties del popup y fuerza colores inline cuando sea necesario. Esto
// permite controlar los colores desde `theme.css` con la variable --swal-*
// sin parchar globalmente `Swal.fire`.

function mergeCustomClass(userCustomClass) {
  const base = { popup: 'my-swal-popup', confirmButton: 'my-swal-confirm', cancelButton: 'my-swal-cancel' };
  if (!userCustomClass) return base;
  return { ...base, ...userCustomClass };
}

function getCssVar(name) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  } catch (e) {
    return '';
  }
}

function applyThemePropsToPopup(popup) {
  if (!popup || !popup.style) return;
  const confirmBg = getCssVar('--swal-confirm-bg') || '';
  const confirmColor = getCssVar('--swal-confirm-color') || '';
  const cancelBg = getCssVar('--swal-cancel-bg') || '';
  const cancelColor = getCssVar('--swal-cancel-color') || '';
  const popupBg = getCssVar('--swal-popup-bg') || '';

  if (popupBg) popup.style.setProperty('--swal-popup-bg', popupBg);
  if (confirmBg) popup.style.setProperty('--swal2-confirm-button-background-color', confirmBg);
  if (confirmColor) popup.style.setProperty('--swal2-confirm-button-color', confirmColor);
  if (cancelBg) popup.style.setProperty('--swal2-cancel-button-background-color', cancelBg);
  if (cancelColor) popup.style.setProperty('--swal2-cancel-button-color', cancelColor);

  // Also set inline colors on buttons to handle cases where background-image
  // or inline background takes precedence in some browsers / setups.
  try {
    const confirmBtn = popup.querySelector && popup.querySelector('.swal2-confirm');
    const cancelBtn = popup.querySelector && popup.querySelector('.swal2-cancel');
    if (confirmBtn && confirmBg) confirmBtn.style.setProperty('background-color', confirmBg, 'important');
    if (confirmBtn && confirmColor) confirmBtn.style.setProperty('color', confirmColor, 'important');
    if (cancelBtn && cancelBg) cancelBtn.style.setProperty('background-color', cancelBg, 'important');
    if (cancelBtn && cancelColor) cancelBtn.style.setProperty('color', cancelColor, 'important');
  } catch (e) {
    // ignore
  }
}

export default function fire(opts) {
  const options = typeof opts === 'string' ? { title: opts } : { ...(opts || {}) };

  // Ensure customClass uses our naming so the CSS in theme.css applies
  options.customClass = mergeCustomClass(options.customClass);

  const userDidOpen = options.didOpen;
  options.didOpen = (popup) => {
    // Apply theme-derived properties to the popup
    try { applyThemePropsToPopup(popup); } catch (e) { /* ignore */ }
    if (typeof userDidOpen === 'function') {
      try { userDidOpen(popup); } catch (e) { /* ignore user handler errors */ }
    }
  };

  return Swal.fire(options);
}

export function confirm(options) {
  return fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Sí',
    cancelButtonText: options.cancelButtonText || 'Cancelar',
    ...options,
  });
}

export function success(title, text) {
  return fire({ icon: 'success', title, text });
}

export function error(title, text) {
  return fire({ icon: 'error', title, text });
}
