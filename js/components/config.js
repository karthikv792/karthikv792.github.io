/**
 * Configuration & Motion Tokens
 * Centralized settings for all animations
 * 
 * Usage: Import this module to access shared configuration
 */

const CONFIG = {
  // Duration tokens (in seconds for GSAP)
  duration: {
    instant: 0,
    xs: 0.15,
    sm: 0.25,
    md: 0.4,
    lg: 0.6,
    xl: 1
  },

  // Easing tokens (GSAP format)
  ease: {
    linear: 'none',
    out: 'power2.out',
    in: 'power2.in',
    inOut: 'power2.inOut',
    smooth: 'power3.out',
    snap: 'power4.out',
    elastic: 'elastic.out(1, 0.5)',
    bounce: 'bounce.out',
    spring: 'back.out(1.7)',
    expo: 'expo.out'
  },

  // Magnetic button settings
  magnetic: {
    threshold: 100,      // Pixels from center to start effect
    strength: 0.4,       // Movement multiplier
    rotation: 3,         // Max rotation degrees
    returnDuration: 0.6  // Spring back duration
  },

  // Scramble text settings
  scramble: {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}',
    duration: 1.5,
    revealDelay: 0.03,
    holdDuration: 2.5
  },

  // Scroll trigger defaults
  scroll: {
    start: 'top 85%',
    end: 'top 50%',
    toggleActions: 'play none none none'
  },

  // Timeline SVG settings
  timeline: {
    strokeWidth: 3,
    glowWidth: 8,
    color: 'var(--color-accent-primary)',
    glowOpacity: 0.4
  },

  // Filter settings
  filter: {
    debounceDelay: 300,
    animationStagger: 0.05
  },

  // News ticker
  ticker: {
    pauseDuration: 2,
    scrollDuration: 0.5
  }
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check for touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.PremiumConfig = CONFIG;
  window.prefersReducedMotion = prefersReducedMotion;
  window.isTouchDevice = isTouchDevice;
}
