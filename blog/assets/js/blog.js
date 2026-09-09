document.addEventListener('DOMContentLoaded', () => {
  const postsList = document.getElementById('posts-list');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const paginationContainer = document.getElementById('pagination');

  if (!postsList) return;

  let allPosts = [];
  let filteredPosts = [];
  const postsPerPage = 6;
  let currentPage = 1;

  fetch('posts.json')
    .then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.json();
    })
    .then(data => {
      allPosts = data;
      filteredPosts = [...allPosts];
      applySort();
      render();
    })
    .catch(err => {
      console.error('Error loading posts:', err);
      postsList.innerHTML = '<div class="empty-state">Unable to load blog posts. Please refresh the page.</div>';
    });

  function applySort() {
    const sortVal = sortSelect ? sortSelect.value : 'date-desc';
    filteredPosts.sort((a, b) => {
      if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortVal === 'title-asc') return a.title.localeCompare(b.title);
      if (sortVal === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });
  }

  function filterPosts() {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    filteredPosts = allPosts.filter(p => {
      const matchTitle = p.title && p.title.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt && p.excerpt.toLowerCase().includes(q);
      return matchTitle || matchExcerpt;
    });
    applySort();
    currentPage = 1;
    render();
  }

  if (searchInput) searchInput.addEventListener('input', filterPosts);
  if (sortSelect) sortSelect.addEventListener('change', () => {
    applySort();
    render();
  });

  function render() {
    if (filteredPosts.length === 0) {
      postsList.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500);">No posts found matching your search.</div>';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * postsPerPage;
    const endIdx = startIdx + postsPerPage;
    const currentPosts = filteredPosts.slice(startIdx, endIdx);

    postsList.innerHTML = currentPosts.map(post => {
      const imgPath = post.image ? post.image : 'assets/img/posts/' + post.slug + '.png';
      return `
        <a class="post-card" href="posts/${post.slug}.html">
          <div class="post-card-thumb">
            <img src="${imgPath}" alt="${escapeHtml(post.title)}" loading="lazy">
          </div>
          <div class="post-card-body">
            <div class="post-card-meta">${escapeHtml(post.dateDisplay || post.date)}</div>
            <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
            <p class="post-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
            <div class="post-card-footer">
              <span>Read Article</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </a>
      `;
    }).join('');

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = `<button ${currentPage === 1 ? 'disabled' : ''} id="prev-page" aria-label="Previous page">&larr; Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} id="next-page" aria-label="Next page">Next &rarr;</button>`;

    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentPage = parseInt(e.target.dataset.page, 10);
        render();
        window.scrollTo({ top: postsList.offsetTop - 100, behavior: 'smooth' });
      });
    });

    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          render();
          window.scrollTo({ top: postsList.offsetTop - 100, behavior: 'smooth' });
        }
      });
    }

    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          render();
          window.scrollTo({ top: postsList.offsetTop - 100, behavior: 'smooth' });
        }
      });
    }
  }

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
