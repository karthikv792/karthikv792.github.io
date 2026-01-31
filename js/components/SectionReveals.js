/**
 * Section Reveals Component
 * Distinct scroll-triggered animations for each section
 */

class SectionReveals {
  constructor(options = {}) {
    this.options = {
      sectionsSelector: '.tmWelcome',
      cardSelector: '.jumbotron',
      ...options
    };

    this.sections = document.querySelectorAll(this.options.sectionsSelector);

    if (this.sections.length) {
      this.init();
    }
  }

  init() {
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      // Show all elements immediately
      this.sections.forEach(section => {
        section.querySelectorAll('.scroll-triggered, ' + this.options.cardSelector).forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });
      return;
    }

    // Remove default scroll-triggered opacity
    gsap.set('.scroll-triggered', { opacity: 1, y: 0 });

    this.sections.forEach((section, index) => {
      const sectionId = section.id;

      switch (sectionId) {
        case 'hiWindow':
          // Hero handled by HeroTimeline
          break;
        case 'About':
          this.revealAbout(section);
          break;
        case 'Education':
          // Education handled by EducationTimeline
          break;
        case 'Learnings':
          this.revealLearnings(section);
          break;
        case 'RandP':
          this.revealResearch(section);
          break;
        default:
          this.defaultReveal(section);
      }
    });
  }

  revealAbout(section) {
    const CONFIG = window.PremiumConfig || {
      duration: { lg: 0.6 },
      ease: { smooth: 'power3.out' },
      scroll: { start: 'top 85%', toggleActions: 'play none none none' }
    };

    const jumbotrons = section.querySelectorAll(this.options.cardSelector);

    jumbotrons.forEach((el, index) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: CONFIG.duration.lg,
          ease: CONFIG.ease.smooth,
          scrollTrigger: {
            trigger: el,
            start: CONFIG.scroll.start,
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );
    });
  }

  revealLearnings(section) {
    const CONFIG = window.PremiumConfig || {
      duration: { md: 0.4 },
      ease: { out: 'power2.out' },
      scroll: { start: 'top 85%', toggleActions: 'play none none none' }
    };

    const cards = section.querySelectorAll(this.options.cardSelector);

    cards.forEach((card, index) => {
      // Alternate slide direction
      const fromX = index % 2 === 0 ? -30 : 30;

      gsap.fromTo(card,
        { opacity: 0, x: fromX },
        {
          opacity: 1,
          x: 0,
          duration: CONFIG.duration.md,
          ease: CONFIG.ease.out,
          scrollTrigger: {
            trigger: card,
            start: CONFIG.scroll.start,
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );
    });
  }

  revealResearch(section) {
    const CONFIG = window.PremiumConfig || {
      duration: { lg: 0.6 },
      ease: { smooth: 'power3.out' },
      scroll: { start: 'top 85%', toggleActions: 'play none none none' }
    };

    const cards = section.querySelectorAll(this.options.cardSelector);

    cards.forEach((card, index) => {
      // Scale up reveal
      gsap.fromTo(card,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: CONFIG.duration.lg,
          ease: CONFIG.ease.smooth,
          scrollTrigger: {
            trigger: card,
            start: CONFIG.scroll.start,
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );
    });
  }

  defaultReveal(section) {
    const CONFIG = window.PremiumConfig || {
      duration: { md: 0.4 },
      ease: { out: 'power2.out' },
      scroll: { start: 'top 85%', toggleActions: 'play none none none' }
    };

    const elements = section.querySelectorAll('.jumbotron, .scroll-triggered');

    elements.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: CONFIG.duration.md,
          ease: CONFIG.ease.out,
          scrollTrigger: {
            trigger: el,
            start: CONFIG.scroll.start,
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );
    });
  }

  destroy() {
    ScrollTrigger.getAll().forEach(trigger => {
      const triggerEl = trigger.trigger;
      if (triggerEl && [...this.sections].some(s => s.contains(triggerEl))) {
        trigger.kill();
      }
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.SectionReveals = SectionReveals;
}
