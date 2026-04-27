function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Запрет отрицательных чисел в полях с min="0"
document.addEventListener('input', e => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'number' && e.target.min === '0') {
    if (e.target.value !== '' && e.target.value < 0) {
      e.target.value = 0;
    }
  }
});
