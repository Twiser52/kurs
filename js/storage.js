/**
 * storage.js - Модуль для работы с localStorage
 */

const STORAGE_KEY = 'minimal_library_books';

const getBooks = () => {
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (parsed.length) return parsed;
  const defaultBooks = [
      { id: '1', title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', genre: 'Фэнтези', read: true, image: 'https://upload.wikimedia.org/wikipedia/ru/thumb/b/b4/Harry_Potter_and_the_Philosopher%27s_Stone_%E2%80%94_movie.jpg/250px-Harry_Potter_and_the_Philosopher%27s_Stone_%E2%80%94_movie.jpg', readLink: 'https://loveread.ec/read_book.php?id=2317&p=1', totalPages: 332, readPages: 332 },
      { id: '2', title: '451° по Фаренгейту', author: 'Рэй Брэдбери', genre: 'Антиутопия', read: false, image: 'https://fantasy-worlds.org/img/full/346/34650.jpg', readLink: 'https://loveread.ec/read_book.php?id=2039&p=1', totalPages: 256, readPages: 0 },
      { id: '3', title: '1984', author: 'Джордж Оруэлл', genre: 'Антиутопия', read: true, image: 'https://covers.openlibrary.org/b/id/7222246-L.jpg', readLink: 'https://loveread.ec/read_book.php?id=18173&p=1', totalPages: 328, readPages: 328 },
      { id: '4', title: 'Мастер и Маргарита', author: 'М. Булгаков', genre: 'Роман', read: false, image: 'https://simg.marwin.kz/media/catalog/product/c/o/cover1_38_215.jpg', readLink: 'https://loveread.ec/read_book.php?id=1527&p=1', totalPages: 480, readPages: 0 },
      { id: '5', title: 'Преступление и наказание', author: 'Ф. Достоевский', genre: 'Классика', read: false, image: 'https://simg.marwin.kz/media/catalog/product/cache/8d1771fdd19ec2393e47701ba45e606d/c/o/cover1__w600_135_916.jpg', readLink: 'https://loveread.ec/read_book.php?id=1741&p=1', totalPages: 672, readPages: 0 },
      { id: '6', title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', genre: 'Фэнтези', read: true, image: 'https://loveread.ec/img/book_covers/002/2345.jpg', readLink: 'https://loveread.ec/read_book.php?id=2345&p=1', totalPages: 1178, readPages: 1178 },
      { id: '7', title: 'Хоббит', author: 'Дж. Р. Р. Толкин', genre: 'Фэнтези', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrBvTJnAVn_UHTsrlyfow8esUeuLOehD1jA&s', readLink: 'https://loveread.ec/read_book.php?id=2344&p=1', totalPages: 310, readPages: 0 },
      { id: '8', title: 'Дюна', author: 'Фрэнк Герберт', genre: 'Фэнтези', read: false, image: 'https://monster-book.com/sites/default/files/styles/sc290x400/public/books/dyuna.png?itok=Mv1WdXE8', readLink: 'https://loveread.ec/read_book.php?id=8582&p=3', totalPages: 704, readPages: 0 },
      { id: '9', title: 'Метро 2033', author: 'Д. Глуховский', genre: 'Антиутопия', read: true, image: 'https://simg.marwin.kz/media/catalog/product/cache/8d1771fdd19ec2393e47701ba45e606d/c/o/cover1__w600_58_11.jpg', readLink: 'https://loveread.ec/read_book.php?id=2372&p=1', totalPages: 384, readPages: 384 },
      { id: '10', title: 'Мы', author: 'Евгений Замятин', genre: 'Антиутопия', read: false, image: 'https://s.f.kz/prod/514/513423_1000.jpg', readLink: 'https://loveread.ec/read_book.php?id=13045&p=1', totalPages: 224, readPages: 0 },
      { id: '11', title: 'Шерлок Холмс', author: 'А. Конан Дойл', genre: 'Детектив', read: true, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9y9BYiWj4NUoyLRxuoFHN8TcjTzbDHDONcg&s', readLink: 'https://kniga-online.com/books/detektivy-i-trillery/klassicheskij-detektiv/12369-artur-konan-doil-sherlok-xolms-bolshoi-sbornik.html', totalPages: 1120, readPages: 1120 },
      { id: '12', title: 'Десять негритят', author: 'Агата Кристи', genre: 'Детектив', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLq4Z3PT5TpPWboXVMMiM3iiIdUvn9zM8QIg&s', readLink: 'https://kniga-online.com/books/detektivy-i-trillery/klassicheskij-detektiv/12276-agata-kristi-desyat-negrityat.html', totalPages: 288, readPages: 0 },
      { id: '13', title: 'Убийство в Восточном экспрессе', author: 'Агата Кристи', genre: 'Детектив', read: false, image: 'https://simg.marwin.kz/media/catalog/product/cache/41deb699a7fea062a8915debbbb0442c/1/0/10726623_0.jpg', readLink: 'https://kniga-online.com/books/detektivy-i-trillery/klassicheskij-detektiv/148702-agata-kristi-ubiistvo-v-vostochnom-ekspresse.html', totalPages: 256, readPages: 0 },
      { id: '14', title: 'Алхимик', author: 'Пауло Коэльо', genre: 'Роман', read: true, image: 'https://www.litres.ru/pub/c/cover/27355110.jpg', readLink: 'https://kniga-online.com/books/proza/sovremennaja-proza/15457-paulo-koelo-alhimik.html', totalPages: 224, readPages: 224 },
      { id: '15', title: 'Три товарища', author: 'Э. М. Ремарк', genre: 'Роман', read: false, image: 'https://simg.marwin.kz/media/catalog/product/cache/41deb699a7fea062a8915debbbb0442c/c/o/cover1__w600_60_379.jpg', readLink: 'https://loveread.ec/read_book.php?id=3330&p=1', totalPages: 480, readPages: 0 },
      { id: '16', title: 'Гордость и предубеждение', author: 'Джейн Остин', genre: 'Роман', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7qpBInYNau4j8inqXj5mg2F-1hncVlQ9RA&s', readLink: 'https://kniga-online.com/books/yumor/yumoristicheskaya-proza/226155-dzhein-osten-gordost-i-predubezhdenie.html', totalPages: 416, readPages: 0 },
      { id: '17', title: 'Над пропастью во ржи', author: 'Дж. Сэлинджер', genre: 'Роман', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNd4wY2_JQEun-nAIum5qrm4dPBKoVTUVdiTNYy_i0fKyVwBP7S-btLuY_Oj1D7QZzUgLoGOxP3Kt9cT3knRITNoaX0fEqj4sPLR5tLDg&s=10', readLink: 'https://loveread.ec/read_book.php?id=3617&p=1', totalPages: 277, readPages: 0 },
      { id: '18', title: 'Фауст', author: 'И. В. Гёте', genre: 'Классика', read: false, image: 'https://simg.marwin.kz/media/catalog/product/cache/8d1771fdd19ec2393e47701ba45e606d/c/o/cover1__w600_134_6.jpg', readLink: 'https://kniga-online.com/books/other-literature/prochee/425024-faust-fon-gete-iogann-volfgang.html', totalPages: 528, readPages: 0 },
      { id: '19', title: 'Идиот', author: 'Ф. Достоевский', genre: 'Классика', read: false, image: 'https://imo10.labirint.ru/books/761375/cover.jpg/242-0', readLink: 'https://kniga-online.com/books/proza/russkaja-klassicheskaja-proza/345043-idiot-fedor-mihailovich-dostoevskii.html', totalPages: 640, readPages: 0 },
      { id: '20', title: 'Отцы и дети', author: 'И. Тургенев', genre: 'Классика', read: false, image: 'https://imo10.labirint.ru/books/867532/cover.jpg/242-0', readLink: 'https://kniga-online.com/books/proza/raznoe/317119-otcy-i-deti-ivan-sergeevich-turgenev.html', totalPages: 256, readPages: 0 },
      { id: '21', title: 'Анна Каренина', author: 'Л. Толстой', genre: 'Классика', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpA3kT__rb9Tokzvpw0TEpk9sxj7j5sNKkxRS-3wugx82l6GuMSOc5pqAeizGT3nuLxeiJZgkcf-NvhWijjInr9r4qmwSYeHxzLtHbng&s=10', readLink: 'https://kniga-online.com/books/proza/klassicheskaja-proza/136235-lev-tolstoi-anna-karenina.html', totalPages: 864, readPages: 0 },
      { id: '22', title: 'Война и мир', author: 'Л. Толстой', genre: 'Классика', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7fleGw52hfp3QS2VDEdlAnpTq9f96JO2Smm5ajsA9SiyFd0ut53a0O6myC7xCOwad0xaPWW_uEfyZHrd12dIyLRL_XFLY_uS4wNr5B0&s=10', readLink: 'https://kniga-online.com/books/proza/raznoe/404285-voina-i-mir-lev-nikolaevich-tolstoi.html', totalPages: 1225, readPages: 0 },
      { id: '23', title: 'Марсианин', author: 'Энди Вейер', genre: 'Фэнтези', read: true, image: 'https://s.f.kz/prod/463/462946_1000.jpg', readLink: 'https://kniga-online.com/books/fantastika-i-fjentezi/nauchnaja-fantastika/51111-endi-veir-marsianin.html', totalPages: 384, readPages: 384 },
      { id: '24', title: 'Сияние', author: 'Стивен Кинг', genre: 'Детектив', read: false, image: 'https://simg.marwin.kz/media/catalog/product/cache/41deb699a7fea062a8915debbbb0442c/c/o/king_s_siyanie.jpg', readLink: 'https://kniga-online.com/books/fantastika-i-fjentezi/uzhasy-i-mistika/82484-stiven-king-siyanie.html', totalPages: 448, readPages: 0 },
      { id: '25', title: 'Оно', author: 'Стивен Кинг', genre: 'Детектив', read: false, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYzNWvwYge2jTLCBRGu-vTaky-CMwojA54-pDfLtG6fdC5dDO0rKVC5dgEeHCUPQ342OE8xcsefKrTrAhI00gnf81YQ1JLYUF4i7BLlQ68&s=10', readLink: 'https://kniga-online.com/books/fantastika-i-fjentezi/uzhasy-i-mistika/81533-stiven-king-ono.html', totalPages: 1138, readPages: 0 }
    ];
    saveBooks(defaultBooks);
    return defaultBooks;
  }


const editBookDetails = (id, updated) => saveBooks(getBooks().map(b => b.id === id ? { ...b, ...updated } : b));
const saveBooks = books => localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
const addBook = book => saveBooks([...getBooks(), { id: Date.now().toString(), read: false, ...book }]);
const deleteBook = id => saveBooks(getBooks().filter(b => b.id !== id));
const toggleBookStatus = id => saveBooks(getBooks().map(b => b.id === id ? { ...b, read: !b.read, readPages: !b.read ? (b.totalPages || 0) : 0 } : b));
