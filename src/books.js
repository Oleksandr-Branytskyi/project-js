const list = document.getElementById('booksList');
const showMoreBtn = document.getElementById('showMoreBtn');
const booksCount = document.querySelector('.books-count');
const categorySelect = document.getElementById('categorySelect');

const BASE_URL = 'https://books-backend.p.goit.global/books';

let allBooks = [];
let visibleBooks = [];
let startCount = 10;
let loadCount = 4;
let currentCount = startCount;
let currentCategory = 'all';

// === Завантажуємо категорії ===
fetch(`${BASE_URL}/category-list`)
  .then(res => res.json())
  .then(categories => {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.list_name;
      option.textContent = cat.list_name;
      categorySelect.appendChild(option);
    });
  })
  .catch(() => console.log('Error loading categories'));

// === Завантажуємо книги ===
function loadBooks() {
  let url =
    currentCategory === 'all'
      ? `${BASE_URL}/top-books`
      : `${BASE_URL}/category?category=${encodeURIComponent(currentCategory)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      allBooks = currentCategory === 'all' ? data.flatMap(x => x.books) : data;
      currentCount = startCount;
      renderBooks();
    })
    .catch(() => {
      list.innerHTML = `<p class="error">Failed to load books</p>`;
    });
}

// === Рендерим книги ===
function renderBooks() {
  visibleBooks = allBooks.slice(0, currentCount);
  list.innerHTML = visibleBooks
    .map(
      book => `
      <li class="book-item">
        <img src="${book.book_image}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p class="price">$${book.price ? book.price : '0.00'}</p>
        <button class="learn-more">Learn More</button>
      </li>`
    )
    .join('');

  booksCount.textContent = `Showing ${visibleBooks.length} of ${allBooks.length}`;
  showMoreBtn.style.display =
    visibleBooks.length >= allBooks.length ? 'none' : 'block';
}

// === Кнопка Show More ===
showMoreBtn.addEventListener('click', () => {
  currentCount += loadCount;
  renderBooks();
});

// === Зміна категорії ===
categorySelect.addEventListener('change', e => {
  currentCategory = e.target.value;
  loadBooks();
});

// === Старт ===
loadBooks();
