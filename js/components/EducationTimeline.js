/**
 * Education Timeline Component
 * Connected journey with SVG line drawing and milestone animations
 */

class EducationTimeline {
  constructor(options = {}) {
    this.options = {
      sectionSelector: '#Education',
      containerSelector: '.container-fluid',
      cardSelector: '.jumbotron',
      ...options
    };

    this.section = document.querySelector(this.options.sectionSelector);
    this.svg = null;
    this.path = null;
    this.glowPath = null;

    if (this.section) {
      this.init();
    }
  }

  init() {
    this.createTimelineSVG();
    this.animateMilestones();
  }

  createTimelineSVG() {
    const CONFIG = window.PremiumConfig || {
      timeline: { strokeWidth: 3, glowWidth: 8, glowOpacity: 0.4 }
    };

    const container = this.section.querySelector(this.options.containerSelector);
    const cards = this.section.querySelectorAll(this.options.cardSelector);

    if (!container || cards.length < 2) return;

    // Create SVG container
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('timeline-svg');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    this.svg.setAttribute('aria-hidden', 'true');

    // Create glow path (behind main path)
    this.glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.glowPath.classList.add('timeline-path-glow');
    this.glowPath.style.filter = 'blur(8px)';
    this.glowPath.style.opacity = CONFIG.timeline.glowOpacity;
    this.svg.appendChild(this.glowPath);

    // Create main path
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.classList.add('timeline-path');
    this.svg.appendChild(this.path);

    container.style.position = 'relative';
    container.insertBefore(this.svg, container.firstChild);

    // Initial update and resize handler
    const Utils = window.Utils || { debounce: (fn, ms) => fn };
    this.updatePath = this.createUpdatePath(container, cards);
    
    setTimeout(this.updatePath, 100);
    window.addEventListener('resize', Utils.debounce(this.updatePath, 200));

    // Scroll-triggered path drawing
    this.setupScrollAnimation();
  }

  createUpdatePath(container, cards) {
    return () => {
      const containerRect = container.getBoundingClientRect();

      this.svg.style.width = '100%';
      this.svg.style.height = `${container.scrollHeight}px`;
      this.svg.style.position = 'absolute';
      this.svg.style.top = '0';
      this.svg.style.left = '0';
      this.svg.style.pointerEvents = 'none';
      this.svg.style.zIndex = '0';

      let pathD = '';
      const midX = containerRect.width / 2;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top - containerRect.top + cardRect.height / 2;
        const cardCenterX = (cardRect.left - containerRect.left) + cardRect.width / 2;

        if (index === 0) {
          pathD += `M ${midX} 100 `;
        }

        // Create curved path to each card
        const prevY = index === 0 
          ? 100 
          : cards[index - 1].getBoundingClientRect().top - containerRect.top + 
            cards[index - 1].getBoundingClientRect().height / 2;
        const controlY = (prevY + cardTop) / 2;

        pathD += `Q ${midX} ${controlY} ${cardCenterX} ${cardTop} `;

        if (index < cards.length - 1) {
          pathD += `Q ${midX} ${cardTop + 50} ${midX} ${cardTop + 100} `;
        }
      });

      this.path.setAttribute('d', pathD);
      this.glowPath.setAttribute('d', pathD);

      // Set up stroke animation
      const pathLength = this.path.getTotalLength();
      this.path.style.strokeDasharray = pathLength;
      this.path.style.strokeDashoffset = pathLength;
      this.glowPath.style.strokeDasharray = pathLength;
      this.glowPath.style.strokeDashoffset = pathLength;
    };
  }

  setupScrollAnimation() {
    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') {
      // Show full path immediately
      if (this.path) {
        this.path.style.strokeDashoffset = 0;
        this.glowPath.style.strokeDashoffset = 0;
      }
      return;
    }

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: (self) => {
        if (!this.path) return;
        const pathLength = this.path.getTotalLength();
        const drawLength = pathLength * (1 - self.progress);
        this.path.style.strokeDashoffset = drawLength;
        this.glowPath.style.strokeDashoffset = drawLength;
      }
    });
  }

  animateMilestones() {
    const CONFIG = window.PremiumConfig || {
      duration: { md: 0.4, lg: 0.6 },
      ease: { smooth: 'power3.out', elastic: 'elastic.out(1, 0.5)' },
      scroll: { start: 'top 85%', toggleActions: 'play none none reverse' }
    };

    const prefersReducedMotion = window.prefersReducedMotion ?? 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = this.section.querySelectorAll(this.options.cardSelector);

    cards.forEach((card, index) => {
      // Add milestone node
      const node = document.createElement('div');
      node.className = 'timeline-node';
      node.setAttribute('aria-hidden', 'true');
      card.style.position = 'relative';
      card.appendChild(node);

      if (prefersReducedMotion || typeof gsap === 'undefined') {
        card.style.opacity = '1';
        card.style.transform = 'none';
        return;
      }

      // Alternate slide direction
      const fromX = index % 2 === 0 ? -50 : 50;

      gsap.fromTo(card,
        { opacity: 0, x: fromX, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: CONFIG.duration.lg,
          ease: CONFIG.ease.smooth,
          scrollTrigger: {
            trigger: card,
            start: CONFIG.scroll.start,
            end: 'top 50%',
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );

      // Node pulse animation on reveal
      gsap.fromTo(node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: CONFIG.duration.md,
          ease: CONFIG.ease.elastic,
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: CONFIG.scroll.toggleActions
          }
        }
      );
    });
  }

  destroy() {
    if (this.svg) {
      this.svg.remove();
    }
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === this.section) t.kill();
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.EducationTimeline = EducationTimeline;
}
