document.addEventListener('DOMContentLoaded', () => {
  populateGenres(); renderBooks();
  document.getElementById('bookModal')?.addEventListener('click', e => e.target.id === 'bookModal' && closeModal());
});

let currentModalBookId = null, currentPage = 1;
const ITEMS_PER_PAGE = 12;

// Format reading time in seconds to human-readable Russian string
const formatReadingTime = (totalSec) => {
  if (!totalSec || totalSec < 1) return null;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h} ч ${m} мин`;
  if (m > 0) return `${m} мин ${s} сек`;
  return `${s} сек`;
};

const applyFilters = () => { currentPage = 1; renderBooks(); };

const populateGenres = () => {
  const sel = document.getElementById('filterGenre');
  if (!sel) return;
  const currentGenre = sel.value;
  const genres = [...new Set(getBooks().map(b => b.genre))].filter(Boolean).sort();
  
  sel.innerHTML = `<option value="all">Все жанры</option>` + 
    genres.map(g => `<option value="${g}">${g}</option>`).join('');
  
  if (genres.includes(currentGenre)) sel.value = currentGenre;
  else sel.value = 'all';
};

const renderBooks = () => {
  const list = document.getElementById('bookList');
  if (!list) return;

  const q = (document.getElementById('searchBook')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || 'all';
  const g = document.getElementById('filterGenre')?.value || 'all';
  const s = document.getElementById('sortBooks')?.value || 'newest';


  let books = getBooks().filter(b => 
    (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
    (st === 'all' || b.read === (st === 'read')) &&
    (g === 'all' || b.genre === g)
  );

  books.sort((a, b) => s === 'az' ? a.title.localeCompare(b.title) : s === 'za' ? b.title.localeCompare(a.title) : 0);
  if (s === 'newest') books.reverse();

  const totalPages = Math.max(1, Math.ceil(books.length / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(1, currentPage), totalPages);

  list.innerHTML = books.length ? books.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(b => `
    <div class="book-card" onclick="openModal('${b.id}')">
      ${b.read ? '<div class="status-badge read">Прочитано</div>' : ''}
      <img src="${b.image || 'https://via.placeholder.com/300x450?text=Нет+обложки'}" alt="${escapeHTML(b.title)}" class="book-cover">
      <div class="book-info">
        <div class="book-title">${escapeHTML(b.title)}</div>
        <div class="book-meta" style="margin-bottom: 15px;">${escapeHTML(b.author)} • ${escapeHTML(b.genre)}</div>
        <div style="margin-top: auto;">
          ${b.totalPages > 0 ? `
          <div class="book-progress" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 6px; color: var(--neutral);">
              <span>Прогресс</span>
              <span>${b.readPages || 0} / ${b.totalPages} стр.</span>
            </div>
            <div style="height: 6px; background-color: rgba(0,0,0,0.08); border-radius: 3px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min(Math.round(((b.readPages || 0) / b.totalPages) * 100), 100)}%; background-color: var(--accent); transition: width 0.3s;"></div>
            </div>
          </div>
          ` : ''}
          <div class="book-actions" style="display: flex; gap: 15px; flex-wrap: wrap; border-top: 1px solid var(--glass-border); padding-top: 15px;">
            <label class="checkbox-label" onclick="event.stopPropagation()">
              <input type="checkbox" ${b.read ? 'checked' : ''} onchange="handleToggleStatus('${b.id}')"> Прочитано
            </label>
          </div>
        </div>
      </div>
    </div>`).join('') : '<div class="empty-state"><h3>Книг не найдено</h3><p>Измените фильтры или добавьте новую книгу!</p></div>';

  renderPagination(books.length ? totalPages : 0);
};

const renderPagination = (tp) => {
  const p = document.getElementById('pagination');
  if (p) p.innerHTML = tp <= 1 ? '' : `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&laquo;</button>` + 
    Array.from({length: tp}, (_, i) => `<button class="page-btn ${currentPage === i + 1 ? 'active' : ''}" onclick="changePage(${i + 1})">${i + 1}</button>`).join('') + 
    `<button class="page-btn" ${currentPage === tp ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&raquo;</button>`;
};

const changePage = p => { currentPage = p; renderBooks(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
const handleToggleStatus = id => { toggleBookStatus(id); renderBooks(); populateGenres(); };


const openModal = id => {
  const b = getBooks().find(x => x.id === id);
  if (!b) return;
  currentModalBookId = id;
  
  Object.assign(document.getElementById('modalImg'), { src: b.image || 'https://via.placeholder.com/300x450?text=Нет+обложки' });
  Object.entries({Title: b.title, Author: b.author, Genre: b.genre, Status: b.read ? 'Прочитано' : 'Не прочитано'})
    .forEach(([k, v]) => document.getElementById('modal' + k).textContent = v);
  
  const pCont = document.getElementById('modalPagesContainer');
  const pSpan = document.getElementById('modalPages');
  if (pCont && pSpan) {
    if (b.totalPages > 0) {
      pSpan.textContent = `${b.readPages || 0} / ${b.totalPages} стр. (${Math.min(Math.round(((b.readPages || 0) / b.totalPages) * 100), 100)}%)`;
      pCont.style.display = 'block';
    } else {
      pCont.style.display = 'none';
    }
  }
  
  const notesCont = document.getElementById('modalNotesContainer');
  const notesText = document.getElementById('modalNotes');
  if (notesCont && notesText) {
    if (b.notes) {
      notesText.textContent = b.notes;
      notesCont.style.display = 'block';
    } else {
      notesCont.style.display = 'none';
    }
  }

  const readLinkBtn = document.getElementById('modalReadLink');
  if (readLinkBtn) {
    if (b.readLink) {
      readLinkBtn.href = `reader.html?id=${b.id}&url=${encodeURIComponent(b.readLink)}`;
      readLinkBtn.style.display = 'flex';
    } else {
      readLinkBtn.style.display = 'none';
    }
  }

  // Reading time display
  const rtCont = document.getElementById('modalReadingTimeContainer');
  const rtSpan = document.getElementById('modalReadingTime');
  if (rtCont && rtSpan) {
    const formatted = formatReadingTime(b.readingTime);
    if (formatted) {
      rtSpan.textContent = formatted;
      rtCont.style.display = 'block';
    } else {
      rtCont.style.display = 'none';
    }
  }



  document.getElementById('bookModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  closeEditMode();
};

const closeModal = () => { document.getElementById('bookModal').classList.remove('active'); document.body.style.overflow = ''; currentModalBookId = null; };
const toggleStatusModal = () => { if (currentModalBookId) { handleToggleStatus(currentModalBookId); openModal(currentModalBookId); } };

const deleteFromModal = () => { if (currentModalBookId && confirm(`Вы уверены, что хотите удалить книгу?`)) { deleteBook(currentModalBookId); closeModal(); renderBooks(); populateGenres(); } };

const openEditMode = () => {
  const b = getBooks().find(x => x.id === currentModalBookId);
  if (b) {
    ['Title', 'Author', 'Genre', 'Image'].forEach(f => document.getElementById('edit' + f).value = b[f.toLowerCase()] || '');
    const rl = document.getElementById('editReadLink');
    if (rl) rl.value = b.readLink || '';
    const tp = document.getElementById('editTotalPages');
    if (tp) tp.value = b.totalPages || '';
    const rp = document.getElementById('editReadPages');
    if (rp) rp.value = b.readPages || '';
    const en = document.getElementById('editNotes');
    if (en) en.value = b.notes || '';
    // Reading time in edit mode
    const rtGroup = document.getElementById('editReadingTimeGroup');
    const rtDisplay = document.getElementById('editReadingTimeDisplay');
    if (rtGroup && rtDisplay) {
      const formatted = formatReadingTime(b.readingTime);
      if (formatted) {
        rtDisplay.textContent = formatted;
        rtGroup.style.display = 'block';
      } else {
        rtGroup.style.display = 'none';
      }
    }
  }
  document.getElementById('modalView').style.display = 'none';
  document.getElementById('modalEdit').style.display = 'block';
};

const closeEditMode = () => {
  document.getElementById('modalView').style.display = 'block';
  document.getElementById('modalEdit').style.display = 'none';
};

const saveEdit = () => {
  if (!currentModalBookId) return;
  const [title, author, genre, image] = ['Title', 'Author', 'Genre', 'Image'].map(f => document.getElementById('edit' + f).value.trim());
  const readLink = document.getElementById('editReadLink')?.value.trim() || '';
  const totalPages = parseInt(document.getElementById('editTotalPages')?.value) || 0;
  const readPages = parseInt(document.getElementById('editReadPages')?.value) || 0;
  const notes = document.getElementById('editNotes')?.value.trim() || '';
  
  if (!title || !author || !genre) return alert('Пожалуйста, заполните основные поля (Название, Автор, Жанр)!');
  if (totalPages < 0 || totalPages > 10000) return alert('Количество страниц должно быть от 0 до 10000!');
  if (readPages < 0 || readPages > totalPages) return alert('Прочитано не может быть меньше 0 или больше общего количества страниц!');
  
  const b = getBooks().find(x => x.id === currentModalBookId);
  let isRead = b ? b.read : false;
  if (totalPages > 0 && readPages >= totalPages) isRead = true;
  else if (totalPages > 0 && readPages < totalPages) isRead = false;

  editBookDetails(currentModalBookId, { title, author, genre, image, readLink, totalPages, readPages, notes, read: isRead });
  renderBooks(); populateGenres(); openModal(currentModalBookId);
};

const resetReadingTime = () => {
  if (!currentModalBookId) return;
  if (!confirm('Сбросить время чтения этой книги?')) return;
  editBookDetails(currentModalBookId, { readingTime: 0 });
  const rtDisplay = document.getElementById('editReadingTimeDisplay');
  if (rtDisplay) rtDisplay.textContent = '0 сек';
  const rtGroup = document.getElementById('editReadingTimeGroup');
  if (rtGroup) rtGroup.style.display = 'none';
};
