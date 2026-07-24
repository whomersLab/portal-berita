/* =====================================================
   MAIN.JS — Homepage Logic
   Portal Berita Statis
   ===================================================== */

const DATA_URL = 'news-data.json';
let allNews = [];

// ─── UTILITIES ───────────────────────────────────────

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
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

function getBadgeClass(category) {
  return `badge badge-${category}`;
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

  // Duplicate for seamless loop
  const html = [...items, ...items].map(n =>
    `<span class="ticker-item" onclick="navigateTo('article.html', {id: '${n.id}'})">
      📰 ${n.title}
    </span>`
  ).join('');

  ticker.innerHTML = html;
}

// ─── HERO BANNER ─────────────────────────────────────

function renderHero(headlines) {
  const container = document.getElementById('hero-container');
  if (!container || headlines.length === 0) return;

  const main = headlines[0];
  const subs = headlines.slice(1, 3);

  let html = `<div class="hero-grid animate-fade">`;

  // Main article
  html += `
    <article class="hero-main" onclick="navigateTo('article.html', {id: '${main.id}'})" role="article" aria-label="Berita Utama">
      <div class="hero-card">
        <img src="${main.thumbnail}" alt="${main.title}" class="hero-card-img" loading="eager" onerror="this.src='assets/images/hero-1.png'">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-meta">
            <span class="${getBadgeClass(main.category)}">${main.category}</span>
            <span class="hero-author">⏱ ${timeAgo(main.date)}</span>
          </div>
          <h2 class="hero-title">${main.title}</h2>
          <p class="hero-author">Oleh ${main.author}</p>
        </div>
      </div>
    </article>
  `;

  // Sub articles
  subs.forEach(article => {
    html += `
      <article class="hero-sub" onclick="navigateTo('article.html', {id: '${article.id}'})" role="article">
        <div class="hero-card">
          <img src="${article.thumbnail}" alt="${article.title}" class="hero-card-img" loading="eager" onerror="this.src='assets/images/hero-2.png'">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="hero-meta">
              <span class="${getBadgeClass(article.category)}">${article.category}</span>
            </div>
            <h3 class="hero-title">${article.title}</h3>
          </div>
        </div>
      </article>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// ─── NEWS CARD ───────────────────────────────────────

function createNewsCard(article) {
  const card = document.createElement('article');
  card.className = 'news-card animate-fade-up';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', article.title);
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
      <span class="${getBadgeClass(article.category)}">${article.category}</span>
      <h3 class="news-card-title">${article.title}</h3>
      <p class="news-card-summary">${article.summary}</p>
      <div class="news-card-footer">
        <div class="news-card-author">
          <div class="author-avatar" aria-hidden="true">${getInitials(article.author)}</div>
          <span>${article.author}</span>
        </div>
        <time datetime="${article.date}">${timeAgo(article.date)}</time>
      </div>
    </div>
  `;
  return card;
}

// ─── SKELETON LOADING ────────────────────────────────

function renderSkeletons(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-title-2"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-2"></div>
      </div>
    </div>
  `).join('');
}

// ─── RENDER NEWS GRID ────────────────────────────────

function renderNewsGrid(news, containerId = 'news-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  container.className = 'news-grid';

  if (news.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div class="no-results-icon">📭</div>
        <h3>Tidak ada berita ditemukan</h3>
        <p class="text-muted" style="margin-top:8px;font-size:.85rem;">Coba kata kunci lain atau pilih kategori berbeda</p>
      </div>
    `;
    return;
  }

  news.forEach(article => {
    container.appendChild(createNewsCard(article));
  });
}

// ─── SEARCH ──────────────────────────────────────────

let searchTimeout;

function handleSearch(query) {
  const q = query.trim().toLowerCase();
  const mainContent = document.getElementById('main-content');
  const searchSection = document.getElementById('search-results-section');
  const searchGrid = document.getElementById('search-grid');
  const searchQuery = document.getElementById('search-query-text');

  if (!q) {
    if (searchSection) searchSection.classList.remove('active');
    if (mainContent) mainContent.style.display = '';
    return;
  }

  const results = allNews.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.summary.toLowerCase().includes(q) ||
    n.author.toLowerCase().includes(q) ||
    n.category.toLowerCase().includes(q)
  );

  if (searchQuery) searchQuery.textContent = `"${query}"`;
  if (mainContent) mainContent.style.display = 'none';
  if (searchSection) searchSection.classList.add('active');

  if (searchGrid) {
    const resultLabel = document.getElementById('search-result-count');
    if (resultLabel) resultLabel.textContent = `${results.length} hasil ditemukan`;
    renderNewsGrid(results, 'search-grid');
  }
}

// ─── CATEGORY FILTER TABS ────────────────────────────

function initCategoryTabs() {
  const tabs = document.querySelectorAll('.home-cat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      const filtered = cat === 'Semua' ? allNews.filter(n => !n.isHeadline) :
        allNews.filter(n => n.category === cat);
      renderNewsGrid(filtered, 'news-grid');
    });
  });
}

// ─── DATE DISPLAY ────────────────────────────────────

function updateHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ─── BACK TO TOP ─────────────────────────────────────

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── NAV ACTIVE ──────────────────────────────────────

function setNavActive() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

// ─── MAIN INIT ───────────────────────────────────────

async function init() {
  updateHeaderDate();
  setNavActive();
  initBackToTop();

  // Skeletons
  renderSkeletons('hero-skeleton', 3);
  renderSkeletons('news-grid', 6);

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('Failed to fetch news data');
    allNews = await res.json();

    const headlines = allNews.filter(n => n.isHeadline);
    const latestNews = allNews.filter(n => !n.isHeadline);

    // Render hero
    const heroSkeleton = document.getElementById('hero-skeleton');
    if (heroSkeleton) heroSkeleton.style.display = 'none';
    renderHero(headlines);

    // Render news grid
    renderNewsGrid(latestNews, 'news-grid');

    // Render ticker
    renderTicker(allNews);

    // Init tabs
    initCategoryTabs();

  } catch (err) {
    console.error('Error loading news:', err);
    const container = document.getElementById('news-grid');
    if (container) {
      container.innerHTML = `
        <div class="no-results" style="grid-column:1/-1">
          <div class="no-results-icon">⚠️</div>
          <h3>Gagal memuat berita</h3>
          <p class="text-muted" style="margin-top:8px;font-size:.85rem;">Silakan refresh halaman atau coba beberapa saat lagi</p>
        </div>
      `;
    }
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        handleSearch('');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);

// Expose global
window.navigateTo = navigateTo;
