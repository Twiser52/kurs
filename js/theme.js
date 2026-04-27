document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');
  const sunIcon = 'https://cdn-icons-png.flaticon.com/128/2222/2222384.png';
  const moonIcon = 'https://cdn-icons-png.flaticon.com/128/606/606807.png';
  
  const updateIcon = (isDark) => {
    if (!toggleBtn) return;
    const img = toggleBtn.querySelector('img');
    if (img) img.src = isDark ? sunIcon : moonIcon;
  };

  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateIcon(true);
  } else {
    updateIcon(false);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateIcon(isDark);
    });
  }
});
