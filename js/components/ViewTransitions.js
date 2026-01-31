/**
 * View Transitions Component
 * Handles View Transition API for premium page navigation
 */

class ViewTransitions {
  constructor(options = {}) {
    this.options = {
      enableForAnchors: true,
      fallbackAnimation: true,
      onNavigate: null,
      ...options
    };

    this.isSupported = 'startViewTransition' in document;
    this.navigationHistory = [];

    if (this.options.enableForAnchors) {
      this.init();
    }
  }

  init() {
    // Handle internal navigation with View Transitions
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Only handle same-origin links
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      // Skip if it's just an anchor on the same page
      if (url.pathname === window.location.pathname && url.hash) {
        return; // Let normal anchor behavior work
      }

      // Skip external links and downloads
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      // Handle navigation
      this.navigateTo(href, e);
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e);
    });
  }

  async navigateTo(href, event) {
    if (event) {
      event.preventDefault();
    }

    const url = new URL(href, window.location.origin);
    
    // Determine navigation direction
    const isBack = this.navigationHistory.includes(href);
    this.navigationHistory.push(window.location.href);

    // Add direction class for CSS animations
    document.documentElement.classList.toggle('forward-nav', !isBack);
    document.documentElement.classList.toggle('back-nav', isBack);

    // Callback before navigation
    if (this.options.onNavigate) {
      this.options.onNavigate({ href, isBack });
    }

    if (this.isSupported) {
      await this.transitionTo(href);
    } else if (this.options.fallbackAnimation) {
      await this.fallbackTransition(href);
    } else {
      window.location.href = href;
    }

    // Clean up direction classes
    document.documentElement.classList.remove('forward-nav', 'back-nav');
  }

  async transitionTo(href) {
    const transition = document.startViewTransition(async () => {
      // Fetch new page
      const response = await fetch(href);
      const html = await response.text();

      // Parse new content
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');

      // Update head (title, meta, etc.)
      document.title = newDoc.title;

      // Update body content
      const newMain = newDoc.querySelector('main') || newDoc.body;
      const currentMain = document.querySelector('main') || document.body;
      
      if (currentMain && newMain) {
        currentMain.innerHTML = newMain.innerHTML;
      }

      // Update URL
      window.history.pushState({}, '', href);

      // Reinitialize components for new content
      this.reinitializeComponents();
    });

    await transition.finished;
  }

  async fallbackTransition(href) {
    const CONFIG = window.PremiumConfig || {
      duration: { md: 0.4 },
      ease: { out: 'power2.out' }
    };

    const main = document.querySelector('main') || document.body;

    if (typeof gsap !== 'undefined') {
      // Fade out
      await gsap.to(main, {
        opacity: 0,
        y: -20,
        duration: CONFIG.duration.md / 2,
        ease: CONFIG.ease.out
      });

      // Navigate
      window.location.href = href;
    } else {
      // CSS-only fallback
      main.style.opacity = '0';
      main.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    }
  }

  handlePopState(event) {
    if (this.isSupported) {
      this.transitionTo(window.location.href);
    } else {
      window.location.reload();
    }
  }

  reinitializeComponents() {
    // Re-run component initialization after content swap
    // This should be customized based on your components
    if (typeof window.initializeComponents === 'function') {
      window.initializeComponents();
    }
  }

  // For multi-page apps: set view-transition-name dynamically
  setTransitionName(element, name) {
    element.style.viewTransitionName = name;
  }

  clearTransitionName(element) {
    element.style.viewTransitionName = '';
  }

  // Check if View Transitions are supported
  static isSupported() {
    return 'startViewTransition' in document;
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.ViewTransitions = ViewTransitions;
}
