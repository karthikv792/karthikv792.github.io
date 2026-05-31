/**
 * Premium Website Components - Main Entry Point
 * Orchestrates all modular components
 * 
 * For static sites: Include this file after all component scripts
 * For module bundlers: Import components individually
 */

// Component registry
const PremiumComponents = {
  instances: {},
  initialized: false,

  /**
   * Initialize all components
   * Call this after DOM is ready and GSAP is loaded
   */
  init(options = {}) {
    if (this.initialized) {
      console.warn('Premium components already initialized');
      return;
    }

    const defaultOptions = {
      scrollProgress: true,
      heroTimeline: true,
      magneticButtons: true,
      educationTimeline: true,
      publicationsFilter: true,
      projectsReveal: true,
      sectionReveals: true,
      navbarScroll: true,
      navbarToggle: true,
      grainOverlay: true,
      viewTransitions: false, // Single-page site uses anchor scroll, not VT
      ...options
    };

    console.log('🚀 Initializing Premium Website Components...');

    // Register GSAP plugins if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize components based on options
    if (defaultOptions.grainOverlay && typeof GrainOverlay !== 'undefined') {
      this.instances.grainOverlay = new GrainOverlay({ animated: false, opacity: 0.03 });
    }

    if (defaultOptions.scrollProgress && typeof ScrollProgress !== 'undefined') {
      this.instances.scrollProgress = new ScrollProgress();
    }

    if (defaultOptions.heroTimeline && typeof HeroTimeline !== 'undefined') {
      this.instances.heroTimeline = new HeroTimeline();
    }

    if (defaultOptions.magneticButtons && typeof MagneticButtons !== 'undefined') {
      this.instances.magneticButtons = new MagneticButtons();
    }

    if (defaultOptions.educationTimeline && typeof EducationTimeline !== 'undefined') {
      this.instances.educationTimeline = new EducationTimeline();
    }

    if (defaultOptions.publicationsFilter && typeof PublicationsFilter !== 'undefined') {
      this.instances.publicationsFilter = new PublicationsFilter();
    }

    if (defaultOptions.projectsReveal && typeof ProjectsReveal !== 'undefined') {
      this.instances.projectsReveal = new ProjectsReveal();
    }

    if (defaultOptions.sectionReveals && typeof SectionReveals !== 'undefined') {
      this.instances.sectionReveals = new SectionReveals();
    }

    if (defaultOptions.navbarScroll && typeof NavbarScroll !== 'undefined') {
      this.instances.navbarScroll = new NavbarScroll();
    }

    if (defaultOptions.navbarToggle && typeof NavbarToggle !== 'undefined') {
      this.instances.navbarToggle = new NavbarToggle();
    }

    if (defaultOptions.viewTransitions && typeof ViewTransitions !== 'undefined') {
      this.instances.viewTransitions = new ViewTransitions();
    }

    this.initialized = true;
    console.log('✨ Premium components initialized');
    console.log(`🎭 Reduced motion: ${window.prefersReducedMotion ? 'enabled' : 'disabled'}`);
  },

  /**
   * Get a component instance
   */
  get(name) {
    return this.instances[name];
  },

  /**
   * Destroy all components and clean up
   */
  destroy() {
    Object.values(this.instances).forEach(instance => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });

    // Kill all ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    this.instances = {};
    this.initialized = false;
    console.log('🧹 Premium components destroyed');
  },

  /**
   * Reinitialize components (useful after dynamic content changes)
   */
  reinit(options = {}) {
    this.destroy();
    this.init(options);
  }
};

// Global function for reinitializing after View Transitions
window.initializeComponents = () => {
  if (PremiumComponents.initialized) {
    PremiumComponents.reinit();
  }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  PremiumComponents.init();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  PremiumComponents.destroy();
});

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.PremiumComponents = PremiumComponents;
}
