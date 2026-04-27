document.addEventListener('DOMContentLoaded', () => {
  const books = getBooks(), total = books.length;
  const totalPagesAll = books.reduce((sum, b) => sum + (b.totalPages || 0), 0);
  const $ = id => document.getElementById(id);
  
  // Animation functions
  const animateValue = (id, start, end, duration) => {
    const obj = $(id);
    if (!obj || start === end) {
      if (obj) obj.textContent = end;
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smoother cubic easing: easeOutExpo approximation
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      obj.textContent = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  };

  // Add CSS classes for staggered fade-in animations
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((card, i) => {
    card.classList.add('animate-fade-up');
    card.style.animationDelay = `${i * 0.2}s`;
  });
  
  const chartCont = document.querySelector('.chart-container');
  if (chartCont) {
    chartCont.classList.add('animate-scale-in');
    chartCont.style.animationDelay = '0.6s';
  }
  
  const detailsGrid = document.querySelector('.stats-details-grid');
  if (detailsGrid) {
    detailsGrid.classList.add('animate-fade-up');
    detailsGrid.style.animationDelay = '0.8s';
  }
  
  if (total) {
    const count = arr => arr.reduce((a, v) => (a[v] = (a[v] || 0) + 1, a), {});
    const top = obj => Object.entries(obj).sort((a, b) => b[1] - a[1]);
    const authors = top(count(books.map(b => b.author)));
    const genres = top(count(books.map(b => b.genre)));
    
    if ($('statFavAuthor') && authors.length) {
      $('statFavAuthor').textContent = authors[0][0];
    }
    
    const favBook = books.find(b => b.title.toLowerCase().includes('оно')) || books.reduce((max, b) => (b.totalPages || 0) > (max.totalPages || 0) ? b : max, books[0]);
    if ($('statFavBook')) {
      $('statFavBook').textContent = favBook ? favBook.title : '-';
    }
    
    animateValue('statTotalBooks', 0, total, 2500);
    animateValue('statTotalPages', 0, totalPagesAll, 3000);
    
    let sizes = [
      { label: 'До 200 стр.', count: 0, color: '#1B3022' },
      { label: '200 - 400 стр.', count: 0, color: '#8C6A46' },
      { label: '400 - 600 стр.', count: 0, color: '#5C7461' },
      { label: '600+ стр.', count: 0, color: '#C4A98D' }
    ];
    
    let validBooksCount = 0;
    books.forEach(b => {
      if (b.totalPages && b.totalPages > 0) {
        validBooksCount++;
        if (b.totalPages <= 200) sizes[0].count++;
        else if (b.totalPages <= 400) sizes[1].count++;
        else if (b.totalPages <= 600) sizes[2].count++;
        else sizes[3].count++;
      }
    });
    
    let chartData = sizes.filter(s => s.count > 0);
    if (chartData.length === 0) {
      chartData = [{ label: 'Нет данных', count: 1, color: 'var(--border-color)' }];
    }
    
    let legendHtml = '';
    const totalForChart = chartData.reduce((sum, d) => sum + d.count, 0);
    const targetPcts = chartData.map(d => (d.count / totalForChart) * 100);

    chartData.forEach((d, i) => {
      const pct = targetPcts[i];
      legendHtml += `
        <li class="animate-fade-up" style="animation-delay: ${0.8 + i * 0.15}s; display: flex; align-items: center; margin-bottom: 12px; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 16px; height: 16px; background: ${d.color}; border-radius: 4px; margin-right: 12px;"></span>
            <span>${d.label}</span>
          </div>
          <strong style="margin-left: 15px;">${Math.round(pct)}%</strong>
        </li>
      `;
    });
    if ($('chartLegendList')) $('chartLegendList').innerHTML = legendHtml;
    
    if ($('readPieChart')) {
      $('readPieChart').style.background = `conic-gradient(transparent 0%, transparent 100%)`;
      let startTimestamp = null;
      const duration = 3000;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        let p = 0;
        let parts = [];
        chartData.forEach((d, i) => {
           const size = targetPcts[i] * easeProgress;
           parts.push(`${d.color} ${p}% ${p + size}%`);
           p += size;
        });
        parts.push(`transparent ${p}% 100%`);
        $('readPieChart').style.background = `conic-gradient(${parts.join(', ')})`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      setTimeout(() => window.requestAnimationFrame(step), 800);
    }
    
    const avgPages = validBooksCount > 0 ? Math.round(books.reduce((sum, b) => sum + (b.totalPages || 0), 0) / validBooksCount) : 0;
    setTimeout(() => animateValue('chartPercentage', 0, avgPages, 2500), 800);
    
    const rList = (id, data) => $(id) && ($(id).innerHTML = data.slice(0,5).map(([k,v], i) => `<li class="animate-fade-up" style="animation-delay: ${1.0 + i * 0.1}s; display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: var(--tertiary); border-radius: 8px;"><span>${k}</span> <strong class="stats-count">${v}</strong></li>`).join(''));
    rList('genresList', genres); rList('authorsList', authors);
  } else {
    if ($('statTotalBooks')) $('statTotalBooks').textContent = '0';
    if ($('statTotalPages')) $('statTotalPages').textContent = '0';
  }

  // === Reading Time Stats (always runs, independent of book count) ===
  const formatReadTime = (totalSec) => {
    if (!totalSec || totalSec < 1) return '0 сек';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h} ч ${m} мин`;
    if (m > 0) return `${m} мин ${s} сек`;
    return `${s} сек`;
  };

  // Total reading time across all books
  const totalReadingTimeSec = books.reduce((sum, b) => sum + (b.readingTime || 0), 0);
  const booksWithTime = books.filter(b => b.readingTime && b.readingTime > 0);

  // Animate the total reading time card
  const readTimeCard = document.querySelector('#statTotalReadTime')?.closest('.stat-card');
  if (readTimeCard) {
    readTimeCard.classList.add('animate-fade-up');
    readTimeCard.style.animationDelay = '0.5s';
  }

  if ($('statTotalReadTime')) {
    $('statTotalReadTime').textContent = formatReadTime(totalReadingTimeSec);
  }

  if ($('statReadTimeSummary')) {
    $('statReadTimeSummary').innerHTML = booksWithTime.length > 0
      ? `${booksWithTime.length} книг с отслеживанием<br>времени`
      : 'Нет данных';
  }

  // Top books by reading time
  const readingTimeSection = document.getElementById('readingTimeSection');
  if (readingTimeSection) {
    readingTimeSection.classList.add('animate-fade-up');
    readingTimeSection.style.animationDelay = '1.2s';
  }

  // Also dark theme icon inversion for reading time section
  if (document.body.classList.contains('dark-theme')) {
    readingTimeSection?.querySelectorAll('img').forEach(img => img.style.filter = 'invert(1)');
    readTimeCard?.querySelectorAll('.stat-icon img').forEach(img => img.style.filter = 'invert(1)');
  }

  const rtList = $('readingTimeList');
  const rtEmpty = $('readingTimeEmpty');

  if (booksWithTime.length > 0) {
    const topByTime = booksWithTime
      .sort((a, b) => (b.readingTime || 0) - (a.readingTime || 0))
      .slice(0, 5);

    if (rtList) {
      rtList.innerHTML = topByTime.map((b, i) => `
        <li class="animate-fade-up" style="animation-delay: ${1.4 + i * 0.1}s; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 14px 16px; background: var(--tertiary); border-radius: 10px;">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <span style="font-size:1.3rem;font-weight:700;color:var(--secondary);opacity:0.6;flex-shrink:0;">${i + 1}</span>
            <div style="min-width:0;">
              <div style="font-weight:600;color:var(--neutral);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.title}</div>
              <div style="font-size:0.82rem;color:var(--text-muted);">${b.author}</div>
            </div>
          </div>
          <strong class="stats-count" style="flex-shrink:0;margin-left:12px;">${formatReadTime(b.readingTime)}</strong>
        </li>
      `).join('');
    }
    if (rtEmpty) rtEmpty.style.display = 'none';
  } else {
    if (rtList) rtList.innerHTML = '';
    if (rtEmpty) rtEmpty.style.display = 'block';
  }
});
