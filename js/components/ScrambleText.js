/**
 * Scramble Text Component
 * Premium decode/resolve text animation
 * 
 * Usage:
 * new ScrambleText(element, ['Word1', 'Word2'], options);
 */

class ScrambleText {
  constructor(element, words = [], options = {}) {
    const CONFIG = window.PremiumConfig || {
      scramble: { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', duration: 1.5, holdDuration: 2.5 },
      duration: { sm: 0.25, md: 0.4 },
      ease: { out: 'power2.out' }
    };

    this.element = element;
    this.words = words.length ? words : this.parseWordsFromElement();
    this.currentIndex = 0;
    this.isAnimating = false;
    this.frameId = null;
    this.timeoutId = null;

    this.options = {
      chars: CONFIG.scramble.chars,
      duration: CONFIG.scramble.duration,
      holdDuration: CONFIG.scramble.holdDuration,
      loop: true,
      ...options
    };

    if (this.words.length) {
      this.init();
    }
  }

  parseWordsFromElement() {
    // Try to get words from data attribute
    const dataRotate = this.element.dataset.rotate;
    if (dataRotate) {
      try {
        return JSON.parse(dataRotate);
      } catch (e) {
        console.warn('Could not parse data-rotate:', e);
      }
    }
    return [this.element.textContent];
  }

  init() {
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.simpleRotate();
    } else {
      this.scrambleRotate();
    }
  }

  simpleRotate() {
    const CONFIG = window.PremiumConfig || { duration: { sm: 0.25 } };

    const animate = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(this.element, {
          opacity: 0,
          duration: CONFIG.duration.sm,
          onComplete: () => {
            this.element.textContent = this.words[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
            gsap.to(this.element, {
              opacity: 1,
              duration: CONFIG.duration.sm
            });
          }
        });
      } else {
        this.element.textContent = this.words[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.words.length;
      }

      if (this.options.loop || this.currentIndex !== 0) {
        this.timeoutId = setTimeout(animate, this.options.holdDuration * 1000 + 500);
      }
    };

    this.element.textContent = this.words[0];
    this.timeoutId = setTimeout(animate, this.options.holdDuration * 1000);
  }

  scrambleRotate() {
    const CONFIG = window.PremiumConfig || { duration: { md: 0.4 }, ease: { out: 'power2.out' } };

    const scramble = () => {
      const word = this.words[this.currentIndex];
      this.isAnimating = true;

      let progress = 0;
      const totalDuration = this.options.duration * 1000;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        progress = Math.min(elapsed / totalDuration, 1);

        let result = '';
        const revealedCount = Math.floor(progress * word.length);

        for (let i = 0; i < word.length; i++) {
          if (i < revealedCount) {
            result += word[i];
          } else {
            result += this.randomChar();
          }
        }

        this.element.innerHTML = `<span class="scramble-text">${result}</span>`;

        if (progress < 1) {
          this.frameId = requestAnimationFrame(update);
        } else {
          // Final reveal with effects
          this.element.innerHTML = `<span class="scramble-text resolved">${word}</span>`;

          // Letter spacing animation
          const textSpan = this.element.querySelector('.scramble-text');
          if (typeof gsap !== 'undefined' && textSpan) {
            gsap.fromTo(textSpan,
              { letterSpacing: '0.1em' },
              {
                letterSpacing: '0.02em',
                duration: CONFIG.duration.md,
                ease: CONFIG.ease.out
              }
            );
          }

          this.isAnimating = false;
          this.currentIndex = (this.currentIndex + 1) % this.words.length;

          // Wait then scramble next word
          if (this.options.loop || this.currentIndex !== 0) {
            this.timeoutId = setTimeout(scramble, this.options.holdDuration * 1000);
          }
        }
      };

      this.frameId = requestAnimationFrame(update);
    };

    // Start the effect
    scramble();
  }

  randomChar() {
    const chars = this.options.chars;
    return chars[Math.floor(Math.random() * chars.length)];
  }

  // Trigger single scramble to a specific word
  scrambleTo(word) {
    this.stop();
    this.words = [word];
    this.currentIndex = 0;
    this.options.loop = false;
    this.scrambleRotate();
  }

  stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isAnimating = false;
  }

  destroy() {
    this.stop();
    this.element.innerHTML = this.words[0] || '';
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.ScrambleText = ScrambleText;
}
