/* ==========================================
   DEDICATED ARTICLE PAGE JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadArticleDetails();
});

async function loadArticleDetails() {
  try {
    // URL se slug nikalna (e.g., article.html?slug=sexual-health-kya-hai)
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      document.getElementById('article-content-wrapper').innerHTML = `
        <div style="text-align: center; padding: 80px 0;">
          <h2>लेख नहीं मिला (Article Not Found)</h2>
          <p style="margin: 20px 0; color: var(--text-muted);">क्षमा करें, आप जिस लेख को ढूंढ रहे हैं वह मौजूद नहीं है।</p>
          <a href="index.html" class="search-btn-nav" style="display: inline-flex; margin: 0 auto;">होम पर वापस जाएं</a>
        </div>
      `;
      return;
    }

    const response = await fetch('data/articles.json');
    if (!response.ok) {
      throw new Error('Data load karne mein samasya aayi.');
    }
    const articles = await response.json();

    // Slug ke mutabiq article find karna
    const article = articles.find(a => a.slug === slug);

    if (!article) {
      document.getElementById('article-content-wrapper').innerHTML = `
        <div style="text-align: center; padding: 80px 0;">
          <h2>लेख नहीं मिला (Article Not Found)</h2>
          <p style="margin: 20px 0; color: var(--text-muted);">यह लेख डेटाबेस में उपलब्ध नहीं है।</p>
          <a href="index.html" class="search-btn-nav" style="display: inline-flex; margin: 0 auto;">होम पर वापस जाएं</a>
        </div>
      `;
      return;
    }

    // Page Title aur Meta Description Update Karna
    document.getElementById('page-title').innerText = `${article.seoTitle} | WellnessHub`;
    document.getElementById('meta-description').setAttribute('content', article.metaDescription);

    // Article Content Render Karna
    const wrapper = document.getElementById('article-content-wrapper');
    wrapper.innerHTML = `
      <article class="detailed-article-box" style="background: var(--card-bg); padding: 50px; border-radius: var(--radius); border: 1px solid var(--border-color); box-shadow: var(--shadow);">
        <div class="article-breadcrumb" style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
          <a href="index.html">होम</a> &gt; <span>${article.category}</span>
        </div>
        
        <span class="card-category" style="margin-bottom: 16px; display: inline-block;">${article.category}</span>
        
        <h1 style="font-size: 38px; font-weight: 900; color: var(--primary); margin-bottom: 20px; line-height: 1.3;">
          ${article.title}
        </h1>

        <div class="article-meta-info" style="display: flex; gap: 20px; font-size: 14px; color: var(--text-muted); margin-bottom: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; font-weight: 600;">
          <span>लेखक: ${article.author}</span>
          <span>•</span>
          <span>प्रकाशित: ${article.date}</span>
          <span>•</span>
          <span>${article.readingTime}</span>
        </div>

        <div class="article-featured-img">
          <img src="${article.image}" alt="${article.title}" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80'">
        </div>

        <div class="article-body-content" style="font-size: 17px; line-height: 1.9; color: var(--text-main);">
          ${article.content}
        </div>

        ${article.faq && article.faq.length > 0 ? `
          <div class="article-faq-section" style="margin-top: 50px; background: #f8fafc; padding: 30px; border-radius: 12px; border-left: 5px solid var(--accent-teal);">
            <h3 style="font-size: 22px; font-weight: 800; color: var(--primary); margin-bottom: 16px;">अक्सर पूछे जाने वाले सवाल (FAQs)</h3>
            <div class="faq-item">
              <h4 style="font-size: 16px; font-weight: 700; color: var(--accent-teal); margin-bottom: 6px;">Q: ${article.faq[0].question}</h4>
              <p style="font-size: 15px; color: var(--text-muted);">Ans: ${article.faq[0].answer}</p>
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 50px; text-align: center; border-top: 1px solid var(--border-color); padding-top: 30px;">
          <a href="index.html" class="search-btn-nav" style="display: inline-flex;">← होमपेज पर वापस जाएं</a>
        </div>
      </article>
    `;

  } catch (error) {
    console.error('Error loading article:', error);
    document.getElementById('article-content-wrapper').innerHTML = `
      <p style="text-align: center; color: var(--accent-coral); padding: 50px;">लेख लोड करने में त्रुटि हुई है। कृपया पुनः प्रयास करें।</p>
    `;
  }
}