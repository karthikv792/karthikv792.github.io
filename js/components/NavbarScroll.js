/**
 * Navbar Scroll Component
 * Scroll-aware navbar with active section highlighting
 */

class NavbarScroll {
  constructor(options = {}) {
    this.options = {
      navbarSelector: '.navbar',
      navLinkSelector: '.nav-link',
      sectionsSelector: '.tmWelcome',
      scrolledClass: 'scrolled',
      activeClass: 'active',
      offset: 100,
      ...options
    };

    this.navbar = document.querySelector(this.options.navbarSelector);
    this.navLinks = document.querySelectorAll(this.options.navLinkSelector);
    this.sections = document.querySelectorAll(this.options.sectionsSelector);

    if (this.navbar) {
      this.init();
    }
  }

  init() {
    this.setupScrollEffect();
    this.setupActiveHighlighting();
    this.setupSmoothScrollLinks();
  }

  setupScrollEffect() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: `${this.options.offset}px top`,
        onUpdate: (self) => {
          if (self.progress > 0.5) {
            this.navbar.classList.add(this.options.scrolledClass);
          } else {
            this.navbar.classList.remove(this.options.scrolledClass);
          }
        }
      });
    } else {
      // Fallback without GSAP
      const Utils = window.Utils || { throttle: (fn) => fn };
      window.addEventListener('scroll', Utils.throttle(() => {
        if (window.scrollY > this.options.offset) {
          this.navbar.classList.add(this.options.scrolledClass);
        } else {
          this.navbar.classList.remove(this.options.scrolledClass);
        }
      }, 100));
    }
  }

  setupActiveHighlighting() {
    const Utils = window.Utils || { throttle: (fn) => fn };

    window.addEventListener('scroll', Utils.throttle(() => {
      this.updateActiveSection();
    }, 100));

    // Initial check
    this.updateActiveSection();
  }

  updateActiveSection() {
    const scrollPos = window.scrollY + 250;

    this.sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        // Remove active from all links
        this.navLinks.forEach(link => {
          link.classList.remove(this.options.activeClass);
        });

        // Add active to current section's link
        const sectionId = section.id;
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add(this.options.activeClass);
        } else if (this.navLinks[index]) {
          this.navLinks[index].classList.add(this.options.activeClass);
        }
      }
    });
  }

  setupSmoothScrollLinks() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Only handle anchor links
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            const Utils = window.Utils || { 
              scrollTo: (el) => el.scrollIntoView({ behavior: 'smooth' })
            };
            Utils.scrollTo(target, this.navbar.offsetHeight);

            // Close mobile nav if open
            const navCollapse = this.navbar.querySelector('.navbar-collapse');
            if (navCollapse && navCollapse.classList.contains('show')) {
              navCollapse.classList.remove('show');
            }
          }
        });
      }
    });
  }

  // Manually set active section
  setActive(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove(this.options.activeClass);
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add(this.options.activeClass);
      }
    });
  }

  destroy() {
    this.navbar.classList.remove(this.options.scrolledClass);
    this.navLinks.forEach(link => {
      link.classList.remove(this.options.activeClass);
    });
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.NavbarScroll = NavbarScroll;
}
