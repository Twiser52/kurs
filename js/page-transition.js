/**
 * page-transition.js — Book page-flip transition between pages
 * Generates a realistic "book page" with faux text, page number and ornament,
 * then animates it flipping when navigating between sections.
 */
(function () {
  'use strict';

  // Faux text snippets (classic literary fragments in Russian)
  const fauxTexts = [
    'Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.',
    'В начале было Слово, и Слово было у Бога, и Слово было Бог.',
    'Я памятник себе воздвиг нерукотворный, к нему не зарастёт народная тропа.',
    'Мне отмщение, и аз воздам. Всё смешалось в доме Облонских.',
    'Однажды весною, в час небывало жаркого заката, в Москве, на Патриарших прудах.',
    'Во всём мне хочется дойти до самой сути. В работе, в поисках пути.',
    'Выхожу один я на дорогу; сквозь туман кремнистый путь блестит.',
    'Мой дядя самых честных правил, когда не в шутку занемог.',
    'Служить бы рад, прислуживаться тошно. Свежо предание, а верится с трудом.',
    'Природа — не храм, а мастерская, и человек в ней работник.',
    'Красота спасёт мир, если мир не уничтожит красоту раньше.',
    'Рукописи не горят. Никогда и ничего не просите, сами предложат и дадут.',
    'Счастье — это когда тебя понимают, большое счастье — когда тебя любят.',
    'Жизнь даётся один раз, и хочется прожить её бодро, осмысленно, красиво.',
    'Какое наслаждение уважать людей! Когда я вижу книги — мне нет дела до автора.',
    'Краткость — сестра таланта. Искусство писать — это искусство сокращать.',
    'Чем ночь темней, тем ярче звёзды, чем глубже скорбь, тем ближе Бог.',
    'Любовь к родному пепелищу, любовь к отеческим гробам. На свете счастья нет.',
  ];

  // Generate the "book page" overlay DOM
  const overlay = document.createElement('div');
  overlay.className = 'page-flip-overlay';

  // Build faux text lines for the page
  const buildPageContent = () => {
    const lineCount = Math.floor(window.innerHeight / 27) - 6; // approx lines that fit
    let lines = '';
    let textIdx = Math.floor(Math.random() * fauxTexts.length);

    for (let i = 0; i < lineCount; i++) {
      const text = fauxTexts[(textIdx + i) % fauxTexts.length];
      lines += `<div class="page-flip-text-line">${text}</div>`;
    }

    const pageNum = Math.floor(Math.random() * 300) + 42;

    return `
      <div class="page-flip-shadow"></div>
      <div class="page-flip-back"></div>
      <div class="page-flip-page">
        <div class="page-flip-ornament">✦ &nbsp; E X L I B R I S &nbsp; ✦</div>
        <div class="page-flip-content">${lines}</div>
        <div class="page-flip-curl"></div>
        <div class="page-flip-page-number">${pageNum}</div>
      </div>
    `;
  };

  overlay.innerHTML = buildPageContent();
  document.body.appendChild(overlay);

  // Internal page patterns
  const internalPages = ['index.html', 'form.html', 'stats.html', 'about.html'];

  const isInternalLink = (href) => {
    if (!href) return false;
    if (href.startsWith('http') && !href.includes(window.location.host)) return false;
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return false;
    return internalPages.some(page => href.includes(page));
  };

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Entry animation on page load
  const playEntryAnimation = () => {
    if (sessionStorage.getItem('exlibris_page_flip') === 'active') {
      sessionStorage.removeItem('exlibris_page_flip');
      // Regenerate content with new random page number
      overlay.innerHTML = buildPageContent();
      overlay.classList.add('entering');
      setTimeout(() => {
        overlay.classList.remove('entering');
      }, 600);
    }
  };

  // Exit animation + navigate
  const navigateWithFlip = (url) => {
    const targetPage = url.split('/').pop().split('?')[0] || 'index.html';
    if (targetPage === currentPage) {
      window.location.href = url;
      return;
    }

    // Regenerate with fresh content for this flip
    overlay.innerHTML = buildPageContent();

    sessionStorage.setItem('exlibris_page_flip', 'active');
    overlay.classList.add('flipping');

    setTimeout(() => {
      window.location.href = url;
    }, 520);
  };

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!isInternalLink(href)) return;
    if (link.target === '_blank') return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;

    e.preventDefault();
    navigateWithFlip(href);
  });

  // Run entry animation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playEntryAnimation);
  } else {
    playEntryAnimation();
  }

  window.navigateWithFlip = navigateWithFlip;
})();
