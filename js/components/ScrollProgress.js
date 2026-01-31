/**
 * Scroll Progress Component
 * Premium scroll progress bar with section indicators
 */

class ScrollProgress {
  constructor(options = {}) {
    this.options = {
      progressBarSelector: '#scroll-progress-bar',
      sectionsSelector: '.tmWelcome',
      showPips: true,
      ...options
    };

    this.progressBar = document.querySelector(this.options.progressBarSelector);
    this.sections = document.querySelectorAll(this.options.sectionsSelector);
    this.pipsContainer = null;

    if (this.progressBar && this.sections.length) {
      this.init();
    }
  }

  init() {
    // Create section pips
    if (this.options.showPips) {
      this.createPips();
    }

    // Set up scroll tracking
    this.setupScrollTracking();
  }

  createPips() {
    this.pipsContainer = document.createElement('div');
    this.pipsContainer.className = 'scroll-pips';
    this.pipsContainer.setAttribute('aria-hidden', 'true');

    this.sections.forEach((section, index) => {
      const pip = document.createElement('button');
      pip.className = 'scroll-pip';
      pip.dataset.section = section.id || `section-${index}`;
      pip.setAttribute('aria-label', `Go to ${section.id || `section ${index + 1}`}`);
      
      pip.addEventListener('click', () => {
        this.scrollToSection(section);
      });

      // Tooltip on hover
      pip.title = this.getSectionTitle(section);

      this.pipsContainer.appendChild(pip);
    });

    document.body.appendChild(this.pipsContainer);
  }

  getSectionTitle(section) {
    // Try to find a title in the section
    const titleEl = section.querySelector('h1, h2, .titles1, .display-4');
    if (titleEl) {
      return titleEl.textContent.trim().substring(0, 30);
    }
    return section.id || 'Section';
  }

  scrollToSection(section) {
    const CONFIG = window.PremiumConfig || { duration: { lg: 0.8 }, ease: { smooth: 'power3.out' } };
    
    if (typeof gsap !== 'undefined' && gsap.to) {
      gsap.to(window, {
        duration: CONFIG.duration.lg,
        scrollTo: { y: section, offsetY: 0 },
        ease: CONFIG.ease.smooth
      });
    } else {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupScrollTracking() {
    const CONFIG = window.PremiumConfig || { duration: { xs: 0.15 }, ease: { out: 'power2.out' } };

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // Use GSAP ScrollTrigger for smooth progress
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          this.updateProgress(self.progress);
          this.updatePips(self.progress);
        }
      });
    } else {
      // Fallback to native scroll events
      window.addEventListener('scroll', Utils.throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        
        this.updateProgress(progress);
        this.updatePips(progress);
      }, 16));
    }
  }

  updateProgress(progress) {
    const CONFIG = window.PremiumConfig || { duration: { xs: 0.15 }, ease: { out: 'power2.out' } };
    const percentage = progress * 100;

    if (typeof gsap !== 'undefined') {
      gsap.to(this.progressBar, {
        width: `${percentage}%`,
        duration: CONFIG.duration.xs,
        ease: CONFIG.ease.out
      });
    } else {
      this.progressBar.style.width = `${percentage}%`;
    }
  }

  updatePips(progress) {
    if (!this.pipsContainer) return;

    const pips = this.pipsContainer.querySelectorAll('.scroll-pip');
    const sectionCount = this.sections.length;

    pips.forEach((pip, index) => {
      // Calculate when this section should be "passed"
      const sectionStart = index / sectionCount;
      const sectionEnd = (index + 1) / sectionCount;
      
      if (progress >= sectionStart) {
        pip.classList.add('active');
      } else {
        pip.classList.remove('active');
      }

      // Current section
      if (progress >= sectionStart && progress < sectionEnd) {
        pip.classList.add('current');
      } else {
        pip.classList.remove('current');
      }
    });
  }

  destroy() {
    if (this.pipsContainer) {
      this.pipsContainer.remove();
    }
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === document.body) t.kill();
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.ScrollProgress = ScrollProgress;
}
