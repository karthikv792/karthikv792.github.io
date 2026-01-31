/**
 * Hero Timeline Component
 * Master animation timeline for the hero section
 */

class HeroTimeline {
  constructor(options = {}) {
    this.options = {
      heroSelector: '#hiWindow',
      greetingSelector: '.titles1',
      nameSelector: '.titles2',
      scrollHintSelector: '.blink_me',
      rotateTextSelector: '.txt-rotate',
      ...options
    };

    this.hero = document.querySelector(this.options.heroSelector);
    this.timeline = null;

    if (this.hero) {
      this.init();
    }
  }

  init() {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25, md: 0.4, lg: 0.6 },
      ease: { smooth: 'power3.out', elastic: 'elastic.out(1, 0.5)' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get hero elements
    const greeting = this.hero.querySelector(this.options.greetingSelector);
    const name = this.hero.querySelector(this.options.nameSelector);
    const scrollHint = this.hero.querySelector(this.options.scrollHintSelector);

    if (prefersReducedMotion) {
      // Simple reveal for reduced motion
      if (typeof gsap !== 'undefined') {
        gsap.set([greeting, name, scrollHint].filter(Boolean), { opacity: 1, y: 0 });
      }
      return;
    }

    if (typeof gsap === 'undefined') {
      // Fallback without GSAP
      [greeting, name, scrollHint].filter(Boolean).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    // Initial state
    gsap.set([greeting, name, scrollHint].filter(Boolean), { opacity: 0, y: 30 });

    // Build master timeline
    this.timeline = gsap.timeline({
      defaults: { ease: CONFIG.ease.smooth }
    });

    if (greeting) {
      this.timeline.to(greeting, {
        opacity: 1,
        y: 0,
        duration: CONFIG.duration.md
      });
    }

    if (name) {
      this.timeline.to(name, {
        opacity: 1,
        y: 0,
        duration: CONFIG.duration.lg,
        ease: CONFIG.ease.elastic
      }, greeting ? '-=0.2' : 0);
    }

    if (scrollHint) {
      this.timeline.to(scrollHint, {
        opacity: 1,
        y: 0,
        duration: CONFIG.duration.md
      }, '-=0.3');

      // Scroll hint fades out on scroll
      this.setupScrollHintFade(scrollHint);
    }

    // Initialize scramble text if present (in About section)
    this.initScrambleText();
  }

  setupScrollHintFade(scrollHint) {
    const CONFIG = window.PremiumConfig || { duration: { xs: 0.15 } };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: this.hero,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          gsap.to(scrollHint, {
            opacity: Math.max(0, 1 - self.progress * 2),
            duration: CONFIG.duration.xs
          });
        }
      });
    }
  }

  initScrambleText() {
    const scrambleElement = document.querySelector('#About .txt-rotate');
    if (scrambleElement) {
      const words = scrambleElement.dataset.rotate;
      if (words) {
        try {
          const parsedWords = JSON.parse(words);
          // Use HandwritingText for a more elegant handwritten feel
          if (typeof HandwritingText !== 'undefined') {
            new HandwritingText(scrambleElement, parsedWords, {
              letterDelay: 70,
              holdDuration: 2000,
              showCursor: true
            });
          } else if (typeof ScrambleText !== 'undefined') {
            // Fallback to ScrambleText if HandwritingText is not available
            new ScrambleText(scrambleElement, parsedWords);
          }
        } catch (e) {
          console.warn('Could not initialize text animation:', e);
        }
      }
    }
  }

  // Replay the animation
  replay() {
    if (this.timeline) {
      this.timeline.restart();
    }
  }

  destroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.HeroTimeline = HeroTimeline;
}
