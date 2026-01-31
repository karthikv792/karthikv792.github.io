/**
 * Grain Overlay Component
 * Premium texture overlay for visual polish
 */

class GrainOverlay {
  constructor(options = {}) {
    this.options = {
      animated: false,
      opacity: 0.035,
      ...options
    };

    this.element = null;
    this.init();
  }

  init() {
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create grain overlay element
    this.element = document.createElement('div');
    this.element.className = 'grain-overlay';
    
    if (this.options.animated && !prefersReducedMotion) {
      this.element.classList.add('animated');
    }

    this.element.style.opacity = this.options.opacity;
    this.element.setAttribute('aria-hidden', 'true');

    document.body.appendChild(this.element);
  }

  setOpacity(opacity) {
    this.options.opacity = opacity;
    if (this.element) {
      this.element.style.opacity = opacity;
    }
  }

  toggleAnimation(enabled) {
    if (!this.element) return;
    
    if (enabled) {
      this.element.classList.add('animated');
    } else {
      this.element.classList.remove('animated');
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

/**
 * Gradient Background Component
 * Ambient gradient with optional animation
 */
class GradientBackground {
  constructor(options = {}) {
    this.options = {
      animated: true,
      variant: 'default', // 'default' | 'light'
      ...options
    };

    this.element = null;
    this.init();
  }

  init() {
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.element = document.createElement('div');
    this.element.className = 'gradient-bg';
    
    if (this.options.variant === 'light') {
      this.element.classList.add('light');
    }
    
    if (this.options.animated && !prefersReducedMotion) {
      this.element.classList.add('animated');
    }

    this.element.setAttribute('aria-hidden', 'true');

    // Insert as first child of body
    document.body.insertBefore(this.element, document.body.firstChild);
  }

  setVariant(variant) {
    if (!this.element) return;
    
    this.element.classList.remove('light');
    if (variant === 'light') {
      this.element.classList.add('light');
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

/**
 * Spotlight Effect Component
 * Cursor-following spotlight for containers
 */
class SpotlightEffect {
  constructor(containerSelector, options = {}) {
    this.options = {
      size: 400,
      ...options
    };

    this.containers = document.querySelectorAll(containerSelector);
    this.spotlights = new Map();

    const isTouchDevice = window.isTouchDevice ?? ('ontouchstart' in window);
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouchDevice && !prefersReducedMotion && this.containers.length) {
      this.init();
    }
  }

  init() {
    this.containers.forEach(container => {
      container.classList.add('spotlight-container');

      const spotlight = document.createElement('div');
      spotlight.className = 'spotlight';
      spotlight.style.width = `${this.options.size}px`;
      spotlight.style.height = `${this.options.size}px`;
      spotlight.setAttribute('aria-hidden', 'true');

      container.appendChild(spotlight);
      this.spotlights.set(container, spotlight);

      container.addEventListener('mousemove', (e) => this.onMouseMove(e, container, spotlight));
    });
  }

  onMouseMove(e, container, spotlight) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (typeof gsap !== 'undefined') {
      gsap.to(spotlight, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
    }
  }

  destroy() {
    this.spotlights.forEach((spotlight, container) => {
      spotlight.remove();
      container.classList.remove('spotlight-container');
    });
    this.spotlights.clear();
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.GrainOverlay = GrainOverlay;
  window.GradientBackground = GradientBackground;
  window.SpotlightEffect = SpotlightEffect;
}
