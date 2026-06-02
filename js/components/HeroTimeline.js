/**
 * Hero Timeline Component
 * Master animation timeline for the hero section
 */

class HeroTimeline {
  constructor(options = {}) {
    this.options = {
      heroSelector: '#hiWindow',
      kickerSelector: '.hero-kicker',
      nameSelector: '.titles2',
      signatureSelector: '.hero-signature',
      taglineSelector: '.hero-tagline',
      affiliationsSelector: '.hero-affiliations',
      ctaSelector: '.hero-cta',
      scrollCueSelector: '.hero-scroll-cue',
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
      ease: { smooth: 'power3.out', expo: 'expo.out' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ??
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const o = this.options;
    const els = {
      kicker: this.hero.querySelector(o.kickerSelector),
      name: this.hero.querySelector(o.nameSelector),
      signature: this.hero.querySelector(o.signatureSelector),
      tagline: this.hero.querySelector(o.taglineSelector),
      affiliations: this.hero.querySelector(o.affiliationsSelector),
      cta: this.hero.querySelector(o.ctaSelector),
      scrollCue: this.hero.querySelector(o.scrollCueSelector)
    };
    const ordered = [els.kicker, els.name, els.signature, els.tagline, els.affiliations, els.cta, els.scrollCue].filter(Boolean);

    // Initialize scramble/handwriting text in About regardless of motion path
    this.initScrambleText();

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      ordered.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.set(ordered, { opacity: 0, y: 24 });
    if (els.signature) gsap.set(els.signature, { opacity: 0, y: 24, rotate: -3 });

    this.timeline = gsap.timeline({
      defaults: { ease: CONFIG.ease.smooth }
    });

    if (els.kicker) {
      this.timeline.to(els.kicker, { opacity: 1, y: 0, duration: CONFIG.duration.md });
    }
    if (els.name) {
      // The hero beat — bigger, expressive reveal
      this.timeline.to(els.name, {
        opacity: 1, y: 0, duration: CONFIG.duration.lg,
        ease: CONFIG.ease.expo || 'expo.out'
      }, '-=0.15');
    }
    if (els.signature) {
      this.timeline.to(els.signature, {
        opacity: 1, y: 0, rotate: -4, duration: CONFIG.duration.lg, ease: 'power2.out'
      }, '-=0.35');
    }
    if (els.tagline) {
      this.timeline.to(els.tagline, { opacity: 1, y: 0, duration: CONFIG.duration.md }, '-=0.3');
    }
    if (els.affiliations) {
      this.timeline.to(els.affiliations, { opacity: 1, y: 0, duration: CONFIG.duration.md }, '-=0.25');
    }
    if (els.cta) {
      this.timeline.to(els.cta, { opacity: 1, y: 0, duration: CONFIG.duration.md }, '-=0.2');
    }
    if (els.scrollCue) {
      this.timeline.to(els.scrollCue, { opacity: 1, y: 0, duration: CONFIG.duration.md }, '-=0.1');
      this.setupScrollCueFade(els.scrollCue);
    }
  }

  setupScrollCueFade(scrollCue) {
    const CONFIG = window.PremiumConfig || { duration: { xs: 0.15 } };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: this.hero,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          gsap.to(scrollCue, {
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
