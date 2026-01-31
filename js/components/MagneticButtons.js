/**
 * Magnetic Buttons Component
 * Premium hover effect that makes buttons follow cursor
 */

class MagneticButtons {
  constructor(selector = '.button-6, .social-btn, .btn--magnetic', options = {}) {
    const CONFIG = window.PremiumConfig || {
      magnetic: { threshold: 100, strength: 0.4, rotation: 3, returnDuration: 0.6 },
      duration: { sm: 0.25 },
      ease: { out: 'power2.out', elastic: 'elastic.out(1, 0.5)' }
    };

    this.buttons = document.querySelectorAll(selector);
    this.options = {
      threshold: CONFIG.magnetic.threshold,
      strength: CONFIG.magnetic.strength,
      rotation: CONFIG.magnetic.rotation,
      returnDuration: CONFIG.magnetic.returnDuration,
      ...options
    };

    // Don't initialize on touch devices or with reduced motion
    const isTouchDevice = window.isTouchDevice ?? ('ontouchstart' in window);
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouchDevice && !prefersReducedMotion && this.buttons.length) {
      this.init();
    }
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => this.onMouseMove(e, button));
      button.addEventListener('mouseleave', (e) => this.onMouseLeave(e, button));
      button.addEventListener('mouseenter', (e) => this.onMouseEnter(e, button));
    });
  }

  onMouseEnter(e, button) {
    // Optional: Add class for CSS styling
    button.classList.add('magnetic-active');
  }

  onMouseMove(e, button) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25 },
      ease: { out: 'power2.out' }
    };

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.options.threshold) {
      // Calculate movement based on distance from center
      const strength = (1 - distance / this.options.threshold) * this.options.strength;
      const rotation = (distX / this.options.threshold) * this.options.rotation;

      if (typeof gsap !== 'undefined') {
        gsap.to(button, {
          x: distX * strength,
          y: distY * strength,
          rotation: rotation,
          duration: CONFIG.duration.sm,
          ease: CONFIG.ease.out
        });
      } else {
        button.style.transform = `translate(${distX * strength}px, ${distY * strength}px) rotate(${rotation}deg)`;
      }
    }
  }

  onMouseLeave(e, button) {
    const CONFIG = window.PremiumConfig || {
      duration: { sm: 0.25 },
      ease: { elastic: 'elastic.out(1, 0.5)' }
    };

    button.classList.remove('magnetic-active');

    if (typeof gsap !== 'undefined') {
      gsap.to(button, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: this.options.returnDuration,
        ease: CONFIG.ease.elastic
      });
    } else {
      button.style.transform = '';
    }
  }

  // Add new button dynamically
  addButton(button) {
    const isTouchDevice = window.isTouchDevice ?? ('ontouchstart' in window);
    if (isTouchDevice) return;

    button.addEventListener('mousemove', (e) => this.onMouseMove(e, button));
    button.addEventListener('mouseleave', (e) => this.onMouseLeave(e, button));
    button.addEventListener('mouseenter', (e) => this.onMouseEnter(e, button));
  }

  destroy() {
    this.buttons.forEach(button => {
      button.classList.remove('magnetic-active');
      button.style.transform = '';
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.MagneticButtons = MagneticButtons;
}
