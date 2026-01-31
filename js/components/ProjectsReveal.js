/**
 * Projects Reveal Component
 * Code-style reveal animations for projects section
 */

class ProjectsReveal {
  constructor(options = {}) {
    this.options = {
      sectionSelector: '#RandP',
      projectsContainerIndex: 1, // Second jumbotron in section
      ...options
    };

    this.section = document.querySelector(this.options.sectionSelector);
    this.projectsContainer = null;

    if (this.section) {
      const containers = this.section.querySelectorAll('.jumbotron');
      this.projectsContainer = containers[this.options.projectsContainerIndex];
    }

    if (this.projectsContainer) {
      this.init();
    }
  }

  init() {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25, md: 0.4 },
      ease: { smooth: 'power3.out', out: 'power2.out' },
      scroll: { start: 'top 90%', toggleActions: 'play none none none' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = this.projectsContainer.querySelectorAll('ol li');

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      items.forEach(item => {
        item.style.opacity = '1';
      });
      return;
    }

    items.forEach((item, index) => {
      item.classList.add('project-item');

      // Staggered slide-in with slight skew
      gsap.fromTo(item,
        { opacity: 0, x: -30, skewX: -2 },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: CONFIG.duration.md,
          ease: CONFIG.ease.smooth,
          scrollTrigger: {
            trigger: item,
            start: CONFIG.scroll.start,
            toggleActions: CONFIG.scroll.toggleActions
          },
          delay: index * 0.08
        }
      );

      // Hover effects
      item.addEventListener('mouseenter', () => this.onHover(item));
      item.addEventListener('mouseleave', () => this.onLeave(item));
    });
  }

  onHover(item) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25 },
      ease: { out: 'power2.out' }
    };

    const link = item.querySelector('a');
    
    if (link && typeof gsap !== 'undefined') {
      gsap.to(link, {
        backgroundSize: '100% 2px',
        duration: CONFIG.duration.sm,
        ease: CONFIG.ease.out
      });
    }

    // Brief glitch effect
    this.glitchEffect(item);
  }

  onLeave(item) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25 },
      ease: { out: 'power2.out' }
    };

    const link = item.querySelector('a');
    
    if (link && typeof gsap !== 'undefined') {
      gsap.to(link, {
        backgroundSize: '0% 2px',
        duration: CONFIG.duration.sm,
        ease: CONFIG.ease.out
      });
    }
  }

  glitchEffect(item) {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline();
    tl.to(item, { x: 2, duration: 0.04 })
      .to(item, { x: -2, duration: 0.04 })
      .to(item, { x: 0, duration: 0.04 });
  }

  destroy() {
    if (!this.projectsContainer) return;
    
    const items = this.projectsContainer.querySelectorAll('ol li');
    items.forEach(item => {
      item.classList.remove('project-item');
      item.style.opacity = '';
      item.style.transform = '';
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.ProjectsReveal = ProjectsReveal;
}
