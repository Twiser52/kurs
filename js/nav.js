/**
 * nav.js — FAB floating bookshelf navigator
 * Works on all pages. Reads data-active attribute from <div id="fabNav"> to mark current page.
 */
(function () {
  const fab = document.getElementById('fabNav');
  if (!fab) return;

  const trigger = fab.querySelector('.fab-trigger');
  const items   = fab.querySelector('.fab-nav-items');

  function open()  { fab.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
  function close() { fab.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }
  function toggle() { fab.classList.contains('open') ? close() : open(); }

  trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  window.toggleFabNav = toggle;
})();
