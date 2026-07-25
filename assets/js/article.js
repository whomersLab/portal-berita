/* =====================================================
   ARTICLE.JS — Halaman Detail Berita
   Portal Berita Statis
   ===================================================== */

const DATA_URL = 'news-data.json';

// ─── UTILITIES ───────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
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

function navigateTo(page, params = {}) {
  const query = new URLSearchParams(params).toString();
  window.location.href = query ? `${page}?${query}` : page;
}

// ─── READING TIME ────────────────────────────────────

function getReadingTime(text) {
  const words = text.split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return `${mins} menit baca`;
}

// ─── RENDER ARTICLE ──────────────────────────────────

function renderArticle(article) {
  const container = document.getElementById('article-content');
  if (!container) return;

  // Update page title and meta
  document.title = `${article.title} — Portal Berita`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', article.summary);

  // Update breadcrumb
  const breadcrumbCat = document.getElementById('breadcrumb-cat');
  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = article.category;
    breadcrumbCat.href = `category.html?cat=${encodeURIComponent(article.category)}`;
  }
  if (breadcrumbTitle) breadcrumbTitle.textContent = article.title.substring(0, 40) + '…';

  // Format content paragraphs
  const allParagraphs = article.content
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`);

  // Insert secondImage after paragraph 3 (index 2) if exists
  let bodyHtml = '';
  if (article.secondImage && allParagraphs.length > 3) {
    const before = allParagraphs.slice(0, 3).join('');
    const after  = allParagraphs.slice(3).join('');
    const imgHtml = `
      <figure class="article-inline-figure animate-fade">
        <img
          src="${article.secondImage}"
          alt="${article.title}"
          class="article-inline-img"
          loading="lazy"
          onerror="this.src='assets/images/hero-1.png'"
        >
      </figure>`;
    bodyHtml = before + imgHtml + after;
  } else {
    bodyHtml = allParagraphs.join('');
  }

  // Tags HTML
  const tagsHtml = (article.tags || []).map(tag =>
    `<span class="tag" onclick="navigateTo('category.html', {cat: '${tag}'})">#${tag}</span>`
  ).join('');

  // Reading time
  const readTime = getReadingTime(article.content);

  container.innerHTML = `
    <header class="article-header animate-fade-up">
      <div class="article-category-time">
        <span class="badge badge-${article.category}">${article.category}</span>
        <span class="text-muted" style="font-size:.8rem">•</span>
        <time class="text-muted" style="font-size:.82rem" datetime="${article.date}">${timeAgo(article.date)}</time>
        <span class="text-muted" style="font-size:.8rem">•</span>
        <span class="text-muted" style="font-size:.82rem">📖 ${readTime}</span>
      </div>

      <h1 class="article-title">${article.title}</h1>

      <blockquote class="article-summary">${article.summary}</blockquote>

      <div class="article-meta">
        <div class="article-meta-author">
          <div class="author-avatar-lg" aria-hidden="true">${getInitials(article.author)}</div>
          <div>
            <div class="meta-author-name">${article.author}</div>
            <div class="meta-author-label">Penulis</div>
          </div>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-info">
          <div><strong>Diterbitkan</strong></div>
          <div>${formatDate(article.date)}</div>
        </div>
      </div>
    </header>

    <img 
      src="${article.thumbnail}" 
      alt="${article.title}" 
      class="article-hero-img animate-fade"
      loading="eager"
      onerror="this.src='assets/images/hero-1.png'"
    >

    <div class="article-body animate-fade-up">
      ${bodyHtml}
    </div>

    <div class="tags-section animate-fade-up">
      ${tagsHtml}
    </div>

    <div class="share-section animate-fade-up">
      <p class="share-title">Bagikan Artikel Ini</p>
      <div class="share-buttons">
        <a 
          href="https://wa.me/?text=${encodeURIComponent(article.title + ' — ' + window.location.href)}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="share-btn share-whatsapp"
          id="share-whatsapp"
          aria-label="Bagikan ke WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <a 
          href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="share-btn share-twitter"
          id="share-twitter"
          aria-label="Bagikan ke Twitter/X"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.842L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter / X
        </a>
        <button 
          class="share-btn share-copy" 
          id="copy-link-btn"
          onclick="copyArticleLink()"
          aria-label="Salin tautan artikel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
          Salin Tautan
        </button>
      </div>
    </div>
  `;
}

// ─── COPY LINK ───────────────────────────────────────

function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = document.getElementById('copy-link-btn');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Tersalin!`;
    btn.style.background = '#2a9d8f';
    btn.style.color = 'white';
    btn.style.borderColor = 'transparent';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style = '';
    }, 2000);
  });
}

// ─── RENDER RELATED ──────────────────────────────────

function renderRelated(articles, currentId) {
  const container = document.getElementById('related-list');
  if (!container) return;

  const related = articles
    .filter(n => n.id !== currentId)
    .slice(0, 4);

  if (related.length === 0) {
    container.innerHTML = `<p class="text-muted" style="font-size:.85rem">Tidak ada artikel terkait.</p>`;
    return;
  }

  container.innerHTML = related.map(article => `
    <div class="related-item" onclick="navigateTo('article.html', {id: '${article.id}'})" role="button" tabindex="0" aria-label="${article.title}">
      <img 
        src="${article.thumbnail}" 
        alt="${article.title}" 
        class="related-item-img"
        onerror="this.src='assets/images/hero-1.png'"
      >
      <div>
        <span class="badge badge-${article.category}" style="font-size:.62rem;margin-bottom:4px;display:inline-flex">${article.category}</span>
        <p class="related-item-title">${article.title}</p>
      </div>
    </div>
  `).join('');
}

// ─── RENDER OTHER CATEGORIES SIDEBAR ─────────────────

function renderPopularSidebar(articles) {
  const container = document.getElementById('popular-list');
  if (!container) return;

  const popular = articles.slice(0, 5);
  container.innerHTML = popular.map((a, i) => `
    <div class="related-item" onclick="navigateTo('article.html', {id: '${a.id}'})" role="button" tabindex="0">
      <span style="font-size:1.4rem;font-weight:900;color:var(--border);min-width:24px">${i + 1}</span>
      <div>
        <span class="badge badge-${a.category}" style="font-size:.62rem;margin-bottom:4px;display:inline-flex">${a.category}</span>
        <p class="related-item-title">${a.title}</p>
      </div>
    </div>
  `).join('');
}

// ─── PROGRESS BAR ────────────────────────────────────

function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
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
  initReadingProgress();

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');

  if (!articleId) {
    document.getElementById('article-content').innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Artikel tidak ditemukan</h3>
        <p class="text-muted" style="margin-top:8px">Kembali ke <a href="index.html" style="color:var(--accent)">Halaman Utama</a></p>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(DATA_URL);
    const allNews = await res.json();

    const article = allNews.find(n => n.id === articleId);

    if (!article) {
      document.getElementById('article-content').innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📭</div>
          <h3>Artikel tidak ditemukan</h3>
          <p class="text-muted" style="margin-top:8px">Kembali ke <a href="index.html" style="color:var(--accent)">Halaman Utama</a></p>
        </div>
      `;
      return;
    }

    // Sembunyikan skeleton loading
    const skeleton = document.getElementById('article-skeleton');
    if (skeleton) skeleton.style.display = 'none';

    renderArticle(article);

    // Related articles (same category)
    const related = allNews.filter(n => n.category === article.category && n.id !== article.id);
    renderRelated(related.length > 0 ? related : allNews.filter(n => n.id !== article.id), article.id);

    // Popular
    renderPopularSidebar(allNews);

  } catch (err) {
    console.error('Error:', err);
    document.getElementById('article-content').innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">⚠️</div>
        <h3>Gagal memuat artikel</h3>
      </div>
    `;
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        window.location.href = `index.html?q=${encodeURIComponent(e.target.value.trim())}`;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);

// Expose global for inline HTML onclick
window.copyArticleLink = copyArticleLink;
window.navigateTo = navigateTo;
