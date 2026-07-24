/* =====================================================
   CATEGORY.JS — Halaman Kategori
   Portal Berita Statis
   ===================================================== */

const DATA_URL = 'news-data.json';
let allNews = [];

// ─── UTILITIES ───────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(dateStr);
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function navigateTo(page, params = {}) {
  const query = new URLSearchParams(params).toString();
  window.location.href = query ? `${page}?${query}` : page;
}

// ─── TICKER ──────────────────────────────────────────

function renderTicker(news) {
  const items = news.slice(0, 8);
  const ticker = document.getElementById('ticker-content');
  if (!ticker) return;
  const html = [...items, ...items].map(n =>
    `<span class="ticker-item" onclick="navigateTo('article.html', {id: '${n.id}'})">📰 ${n.title}</span>`
  ).join('');
  ticker.innerHTML = html;
}

// ─── RENDER NEWS CARD ────────────────────────────────

function createNewsCard(article) {
  const card = document.createElement('article');
  card.className = 'news-card animate-fade-up';
  card.setAttribute('role', 'article');
  card.onclick = () => navigateTo('article.html', { id: article.id });

  card.innerHTML = `
    <div class="news-card-img-wrap">
      <img 
        src="${article.thumbnail}" 
        alt="${article.title}" 
        class="news-card-img" 
        loading="lazy"
        onerror="this.src='assets/images/hero-1.png'"
      >
    </div>
    <div class="news-card-body">
      <span class="badge badge-${article.category}">${article.category}</span>
      <h3 class="news-card-title">${article.title}</h3>
      <p class="news-card-summary">${article.summary}</p>
      <div class="news-card-footer">
        <div class="news-card-author">
          <div class="author-avatar">${getInitials(article.author)}</div>
          <span>${article.author}</span>
        </div>
        <time datetime="${article.date}">${timeAgo(article.date)}</time>
      </div>
    </div>
  `;
  return card;
}

function renderGrid(news) {
  const container = document.getElementById('category-grid');
  const countEl = document.getElementById('article-count');

  if (!container) return;
  container.innerHTML = '';
  container.className = 'news-grid';

  if (countEl) countEl.textContent = `${news.length} artikel`;

  if (news.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div class="no-results-icon">📭</div>
        <h3>Tidak ada artikel di kategori ini</h3>
        <p class="text-muted" style="margin-top:8px;font-size:.85rem;">Silakan pilih kategori lain</p>
      </div>
    `;
    return;
  }

  news.forEach(article => container.appendChild(createNewsCard(article)));
}

// ─── CATEGORY TABS ───────────────────────────────────

function initTabs(activeCategory) {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      const heroTitle = document.getElementById('cat-hero-title');
      const heroDesc = document.getElementById('cat-hero-desc');
      const breadcrumbCat = document.getElementById('breadcrumb-cat');
      const pageTitleEl = document.querySelector('title');

      if (heroTitle) heroTitle.textContent = cat === 'Semua' ? 'Semua Kategori' : `Kategori: ${cat}`;
      if (heroDesc) heroDesc.textContent = cat === 'Semua' ? 'Semua berita terkini' : `Menampilkan semua berita kategori ${cat}`;
      if (breadcrumbCat) breadcrumbCat.textContent = cat;
      if (pageTitleEl) pageTitleEl.textContent = `${cat} — Portal Berita`;

      const filtered = cat === 'Semua' ? allNews : allNews.filter(n => n.category === cat);
      renderGrid(filtered);

      // Update URL without reload
      const url = new URL(window.location);
      url.searchParams.set('cat', cat);
      window.history.replaceState({}, '', url);
    });
  });
}

// ─── BACK TO TOP ─────────────────────────────────────

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function updateHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function setNavActive() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === path);
  });
}

// ─── MAIN INIT ───────────────────────────────────────

async function init() {
  updateHeaderDate();
  setNavActive();
  initBackToTop();

  // Get category from URL
  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get('cat') || 'Semua';

  // Update hero and breadcrumb
  const heroTitle = document.getElementById('cat-hero-title');
  const heroDesc = document.getElementById('cat-hero-desc');
  const breadcrumbCat = document.getElementById('breadcrumb-cat');
  const pageTitleEl = document.querySelector('title');

  if (heroTitle) heroTitle.textContent = activeCategory === 'Semua' ? 'Semua Kategori' : `Kategori: ${activeCategory}`;
  if (heroDesc) heroDesc.textContent = `Menampilkan semua berita kategori ${activeCategory}`;
  if (breadcrumbCat) breadcrumbCat.textContent = activeCategory;
  if (pageTitleEl) pageTitleEl.textContent = `${activeCategory} — Portal Berita`;

  // Set active tab
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.cat === activeCategory);
  });

  try {
    const res = await fetch(DATA_URL);
    allNews = await res.json();

    const filtered = activeCategory === 'Semua' ? allNews : allNews.filter(n => n.category === activeCategory);
    renderGrid(filtered);
    initTabs(activeCategory);
    renderTicker(allNews);

  } catch (err) {
    console.error('Error:', err);
    const grid = document.getElementById('category-grid');
    if (grid) {
      grid.innerHTML = `<div class="no-results" style="grid-column:1/-1">
        <div class="no-results-icon">⚠️</div>
        <h3>Gagal memuat berita</h3>
      </div>`;
    }
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', e => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) {
          const filtered2 = activeCategory === 'Semua' ? allNews : allNews.filter(n => n.category === activeCategory);
          renderGrid(filtered2);
          return;
        }
        const results = allNews.filter(n =>
          n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
        );
        renderGrid(results);
      }, 300);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);

// Expose global
window.navigateTo = navigateTo;
