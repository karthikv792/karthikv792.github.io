/**
 * Main JavaScript Entry Point
 * 
 * This file works alongside the modular component system.
 * Use this for any custom functionality specific to your site.
 * 
 * The modular components (js/components/) handle:
 * - Scroll progress bar
 * - Hero animations
 * - Magnetic buttons
 * - Education timeline
 * - Publications filter
 * - Section reveals
 * - Navbar scroll effects
 * - Grain overlay
 * 
 * Add any additional custom code below.
 */

// ============================================
// LENIS SMOOTH SCROLLING
// ============================================
const ENABLE_LENIS = true;
let lenis = null;

function initNativeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -80);
      }
    });
  });
}

function initLenis() {
  if (!ENABLE_LENIS) {
    console.warn('Lenis disabled - using native smooth scroll');
    return;
  }
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded');
    return;
  }
  
  lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 1.2,
    touchMultiplier: 2,
    infinite: false
  });
  
  // Integrate with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback RAF loop if GSAP not available
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  
  // Handle anchor link clicks with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -80, // Account for fixed navbar
          duration: 0.6 // Faster scroll
        });
      }
    });
  });
  
  console.log('🎬 Lenis smooth scroll initialized');
}

// Initialize Lenis on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  if (!ENABLE_LENIS) {
    initNativeSmoothScroll();
  }
});

// Go to top function (global for onclick)
window.goToTop = function() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 0.8 });
    } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// ============================================
// ANIME.JS LETTER ANIMATIONS
// ============================================
function initLetterAnimations() {
  const textElements = document.querySelectorAll('.animate-letters');
  if (textElements.length === 0) return;

  const prefersReducedMotion = window.prefersReducedMotion ??
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';

  textElements.forEach((el) => {
    // Skip elements that include rotating/handwriting text
    if (el.querySelector('.txt-rotate')) {
      return;
    }
    // Reduced motion or no GSAP: leave text visible, untouched
    if (prefersReducedMotion || !hasGSAP) {
      return;
    }
    // Get the text content
    const text = el.textContent.trim();

    // Clear the element and wrap each letter in a span
    el.innerHTML = '';

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
      span.style.display = 'inline-block';
      el.appendChild(span);
    });

    const letters = el.querySelectorAll('.letter');
    gsap.set(letters, { opacity: 0, yPercent: 60, rotateX: -90 });

    // Create intersection observer for scroll trigger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(letters, {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.025
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });

    observer.observe(el);
  });

  console.log('✨ Letter animations initialized for', textElements.length, 'elements');
}

// Initialize letter animations on DOM ready
document.addEventListener('DOMContentLoaded', initLetterAnimations);

// ============================================
// GSAP STAGGER ANIMATIONS
// ============================================
function initGSAPStaggers() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }
  
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Publications stagger animation
  gsap.utils.toArray('.pub-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.03,
      ease: 'power2.out'
    });
  });
  
  // Skill cards stagger animation
  const skillCards = gsap.utils.toArray('.skill-card');
  if (skillCards.length > 0) {
    gsap.from(skillCards, {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: 'back.out(1.5)'
    });
  }
  
  // Bento cards stagger animation
  const bentoCards = gsap.utils.toArray('.bento-card');
  if (bentoCards.length > 0) {
    bentoCards.forEach((card, i) => {
      gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
  }

  // Timeline items stagger
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if (timelineItems.length > 0) {
    timelineItems.forEach((item, i) => {
      const isLeft = item.classList.contains('timeline-left');
      gsap.from(item, {
          scrollTrigger: {
          trigger: item,
          start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        x: isLeft ? -80 : 80,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    });
  }
  
  // Project cards stagger
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length > 0) {
    gsap.from(projectCards, {
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
          opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out'
    });
  }
  
  // News items stagger
  const newsItems = gsap.utils.toArray('.news-item');
  if (newsItems.length > 0) {
    gsap.from(newsItems, {
      scrollTrigger: {
        trigger: '.news-list',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -30,
            opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out'
    });
  }
  
  console.log('🎯 GSAP stagger animations initialized');
}

// Initialize GSAP staggers after DOM and GSAP are ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for GSAP to be fully ready
  setTimeout(initGSAPStaggers, 100);
});

// ============================================
// CUSTOM SITE FUNCTIONALITY
// ============================================

/**
 * GitHub Stars Fetcher
 * Displays the star count for your LLMs-Planning repo
 */
async function fetchGitHubStars() {
  try {
    const response = await fetch('https://api.github.com/repos/karthikv792/LLMs-Planning');
    const data = await response.json();
    const starsElement = document.getElementById('github-stars');
    if (starsElement) {
      starsElement.textContent = `★ ${data.stargazers_count} stars`;
    }
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    const starsElement = document.getElementById('github-stars');
    if (starsElement) {
      starsElement.textContent = 'GitHub repo';
    }
  }
}

/**
 * Copy Email to Clipboard with Toast
 */
function initEmailCopy() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      // Allow default behavior but also copy to clipboard
      const email = link.href.replace('mailto:', '').split('?')[0];
      
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard!');
      } catch (err) {
        // Fallback - let mailto: work normally
      }
    });
  });
}

/**
 * Light/Dark Theme Toggle
 */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  // Check for saved preference - default to dark
  const savedTheme = localStorage.getItem('theme');
  
  // Apply initial theme (dark is default, no attribute needed)
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Toggle handler
  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isLight = currentTheme === 'light';
    
    if (isLight) {
      // Switch to dark
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      console.log('🌙 Dark mode enabled');
    } else {
      // Switch to light
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      console.log('☀️ Light mode enabled');
    }
  });
  
  console.log('🌓 Theme toggle initialized');
}

/**
 * Show Toast Notification
 */
function showToast(message, duration = 2500) {
  // Check if toast already exists
  let toast = document.querySelector('.copy-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Lazy Load Twitter Embeds
 * Only load Twitter widgets when they come into view
 */
function initLazyTwitter() {
  const tweetContainers = document.querySelectorAll('.tweet-container');
  
  if (tweetContainers.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load Twitter widget if not already loaded
        if (typeof twttr !== 'undefined' && twttr.widgets) {
          twttr.widgets.load(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });
  
  tweetContainers.forEach(container => observer.observe(container));
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-8 8h5v8h6v-8h5z"/>
    </svg>
  `;
  document.body.appendChild(scrollBtn);
  
  // Show/hide based on scroll position (throttled)
  const Utils = window.Utils || { throttle: (fn) => fn };
  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', Utils.throttle(toggleVisibility, 150));
  toggleVisibility();

  // Scroll to top on click (Lenis if present, else native)
  scrollBtn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  }

/**
 * Print Styles Optimization
 */
function initPrintStyles() {
  window.addEventListener('beforeprint', () => {
    // Expand all collapsed sections before printing
    document.querySelectorAll('.news-ticker-container').forEach(el => {
      el.classList.add('expanded');
    });
  });
}

/**
 * Performance Monitoring (Development only)
 */
function initPerformanceMonitoring() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Log Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.startTime.toFixed(0), 'ms');
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      
      // FID
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms');
        });
      }).observe({ type: 'first-input', buffered: true });
      
      // CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('📊 CLS:', clsValue.toFixed(3));
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Custom functionality
  fetchGitHubStars();
  initThemeToggle();
  initEmailCopy();
  initLazyTwitter();
  initScrollToTop();
  initPrintStyles();
  initPerformanceMonitoring();
  
  console.log('🎯 Custom functionality initialized');
});

// Export for potential external use
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.fetchGitHubStars = fetchGitHubStars;
}
