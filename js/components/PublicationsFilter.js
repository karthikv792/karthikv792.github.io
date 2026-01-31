/**
 * Publications Filter Component
 * FLIP-style filter and search with smooth animations
 */

class PublicationsFilter {
  constructor(options = {}) {
    this.options = {
      containerSelector: '#RandP .jumbotron ol',
      ...options
    };

    this.container = document.querySelector(this.options.containerSelector);
    this.publications = [];
    this.filterContainer = null;
    this.searchInput = null;
    this.activeFilter = 'all';

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.parsePublications();
    this.createFilterUI();
  }

  parsePublications() {
    const items = this.container.querySelectorAll('li');
    const Utils = window.Utils || { extractYear: (text) => text.match(/20[0-9]{2}/)?.[0] || '2024' };

    items.forEach((item, index) => {
      const text = item.textContent.toLowerCase();
      const tags = [];

      // Auto-tag based on content keywords
      if (text.includes('llm') || text.includes('language model')) tags.push('llm');
      if (text.includes('planning') || text.includes('plan')) tags.push('planning');
      if (text.includes('reasoning') || text.includes('reason')) tags.push('reasoning');
      if (text.includes('benchmark') || text.includes('evaluation')) tags.push('evaluation');
      if (text.includes('rl') || text.includes('reinforcement')) tags.push('rl');
      if (text.includes('cot') || text.includes('chain of thought')) tags.push('cot');

      item.dataset.tags = tags.join(',');
      item.dataset.year = item.dataset.year || Utils.extractYear(item.textContent) || '2024';
      item.classList.add('publication-item');

      this.publications.push({
        element: item,
        tags: tags,
        year: item.dataset.year,
        text: text
      });
    });
  }

  createFilterUI() {
    const Utils = window.Utils || { debounce: (fn, ms) => fn };

    this.filterContainer = document.createElement('div');
    this.filterContainer.className = 'filter-container';
    this.filterContainer.setAttribute('role', 'group');
    this.filterContainer.setAttribute('aria-label', 'Filter publications');

    const tags = ['all', 'llm', 'planning', 'reasoning', 'evaluation'];

    tags.forEach((tag, index) => {
      const chip = document.createElement('button');
      chip.className = `chip ${index === 0 ? 'active' : ''}`;
      chip.textContent = tag === 'all' ? 'All' : tag.toUpperCase();
      chip.dataset.filter = tag;
      chip.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      chip.addEventListener('click', () => this.filterByTag(tag, chip));
      this.filterContainer.appendChild(chip);
    });

    // Search input removed per user request

    // Insert before the list
    this.container.parentNode.insertBefore(this.filterContainer, this.container);
  }

  filterByTag(tag, activeChip) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25, md: 0.4 },
      ease: { out: 'power2.out' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Update active chip styling
    document.querySelectorAll('.chip').forEach(chip => {
      chip.classList.remove('active');
      chip.setAttribute('aria-pressed', 'false');
    });
    activeChip.classList.add('active');
    activeChip.setAttribute('aria-pressed', 'true');

    this.activeFilter = tag;

    const items = this.container.querySelectorAll('li');

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      items.forEach(item => {
        if (tag === 'all' || item.dataset.tags.includes(tag)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
      return;
    }

    // Animate with FLIP-like effect
    let delay = 0;
    items.forEach(item => {
      const shouldShow = tag === 'all' || item.dataset.tags.includes(tag);

      if (shouldShow) {
        item.style.display = '';
        gsap.fromTo(item,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: CONFIG.duration.md,
            ease: CONFIG.ease.out,
            delay: delay
          }
        );
        delay += 0.03;
      } else {
        gsap.to(item, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: CONFIG.duration.sm,
          ease: CONFIG.ease.out,
          onComplete: () => {
            item.style.display = 'none';
          }
        });
      }
    });
  }

  searchPublications(query) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25 },
      ease: { out: 'power2.out' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = this.container.querySelectorAll('li');
    const lowerQuery = query.toLowerCase().trim();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matchesSearch = !lowerQuery || text.includes(lowerQuery);
      const matchesFilter = this.activeFilter === 'all' || item.dataset.tags.includes(this.activeFilter);
      const shouldShow = matchesSearch && matchesFilter;

      if (shouldShow) {
        item.style.display = '';
        if (!prefersReducedMotion && typeof gsap !== 'undefined') {
          gsap.to(item, { opacity: 1, duration: CONFIG.duration.sm });
        } else {
          item.style.opacity = '1';
        }
      } else {
        if (prefersReducedMotion || typeof gsap === 'undefined') {
          item.style.display = 'none';
        } else {
          gsap.to(item, {
            opacity: 0,
            duration: CONFIG.duration.sm,
            onComplete: () => {
              item.style.display = 'none';
            }
          });
        }
      }
    });
  }

  // Get count of visible items
  getVisibleCount() {
    return [...this.container.querySelectorAll('li')].filter(
      item => item.style.display !== 'none'
    ).length;
  }

  // Reset filters
  reset() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    const allChip = this.filterContainer.querySelector('[data-filter="all"]');
    if (allChip) {
      this.filterByTag('all', allChip);
    }
  }

  destroy() {
    if (this.filterContainer) {
      this.filterContainer.remove();
    }
    this.container.querySelectorAll('li').forEach(item => {
      item.style.display = '';
      item.style.opacity = '';
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.PublicationsFilter = PublicationsFilter;
}
