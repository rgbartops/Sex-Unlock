/* ==========================================
   CORE APP JAVASCRIPT - DYNAMIC RENDERING
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  fetchArticles();
});

async function fetchArticles() {
  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) {
      throw new Error('Articles data load karne mein samasya aayi.');
    }
    const articles = await response.json();

    // Agar URL mein ?cat=... hai, to sirf usi category ke articles dikhao
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('cat');
    const filteredArticles = selectedCategory
      ? articles.filter(article => article.category === selectedCategory)
      : articles;

    updateCategoryHeading(selectedCategory, filteredArticles.length);
    renderFeaturedArticle(filteredArticles);
    renderLatestArticles(filteredArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
}

// Category filter active hone par heading/section-title update karna, taaki user ko pata chale ki filter lag chuka hai
function updateCategoryHeading(selectedCategory, count) {
  const heading = document.querySelector('#latest-articles-grid')?.previousElementSibling;
  if (!heading || !heading.classList.contains('section-title')) return;

  const span = heading.querySelector('span');
  if (!span) return;

  if (selectedCategory) {
    span.textContent = `${selectedCategory} (${count} लेख)`;
  } else {
    span.textContent = 'नवीनतम लेख (Latest Articles)';
  }
}

// Featured Article Render Karna
function renderFeaturedArticle(articles) {
  const featuredContainer = document.getElementById('featured-article-container');
  if (!featuredContainer) return;

  const featured = articles.find(article => article.featured) || articles[0];

  featuredContainer.innerHTML = `
    <div class="article-card featured-card" style="display: grid; grid-template-columns: 1.2fr 1fr; background: var(--card-bg); border-radius: var(--radius); border: 1px solid var(--border-color); overflow: hidden; margin-bottom: 40px;">
      <div class="card-img-wrapper" style="height: 100%; min-height: 300px;">
        <img src="${featured.image}" alt="${featured.title}" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="card-content" style="padding: 40px; display: flex; flex-direction: column; justify-content: center;">
        <span class="card-category">विशेष लेख • ${featured.category}</span>
        <h2 class="card-title" style="font-size: 26px; margin: 12px 0 16px;">
          <a href="article.html?slug=${featured.slug}">${featured.title}</a>
        </h2>
        <p class="card-excerpt" style="font-size: 16px; margin-bottom: 24px;">${featured.excerpt}</p>
        <div class="card-meta">
          <span>${featured.author}</span>
          <span>${featured.readingTime}</span>
        </div>
      </div>
    </div>
  `;
}

// Latest Articles Grid Render Karna
function renderLatestArticles(articles) {
  const gridContainer = document.getElementById('latest-articles-grid');
  if (!gridContainer) return;

  if (articles.length === 0) {
    gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 0;">इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है।</p>`;
    return;
  }

  gridContainer.innerHTML = articles.map(article => `
    <article class="article-card">
      <div class="card-img-wrapper">
        <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'">
      </div>
      <div class="card-content">
        <span class="card-category">${article.category}</span>
        <h3 class="card-title">
          <a href="article.html?slug=${article.slug}">${article.title}</a>
        </h3>
        <p class="card-excerpt">${article.excerpt}</p>
        <div class="card-meta">
          <span>${article.date}</span>
          <span>${article.readingTime}</span>
        </div>
      </div>
    </article>
  `).join('');
}