document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addBookForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const [title, author, genre, image, readLink] = ['title', 'author', 'genre', 'image', 'readLink'].map(id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    });
    const totalPages = parseInt(document.getElementById('totalPages')?.value) || 0;
    const readPages = parseInt(document.getElementById('readPages')?.value) || 0;
    const notes = document.getElementById('notes')?.value.trim() || '';
    
    let isRead = false;
    if (totalPages > 0 && readPages >= totalPages) isRead = true;

    if (!title || !author || !genre) return alert('Пожалуйста, заполните основные поля!');
    
    // Валидация страниц
    if (totalPages < 0 || totalPages > 10000) return alert('Количество страниц должно быть от 0 до 10000!');
    if (readPages < 0 || readPages > totalPages) return alert('Прочитано не может быть меньше 0 или больше общего количества страниц!');

    // Лимит библиотеки
    if (getBooks().length >= 300) return alert('Библиотека переполнена! Лимит — 300 книг. Удалите что-нибудь перед добавлением.');

    addBook({ title, author, genre, image, readLink, notes, totalPages, readPages, read: isRead });
    alert('Книга успешно добавлена!');
    window.location.href = 'index.html';
  });
});
