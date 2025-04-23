// Scroll-related functionality
document.addEventListener('DOMContentLoaded', function() {
  const progressBar = document.getElementById('scroll-progress-bar');

  // Function to update scroll progress bar
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Avoid division by zero if scrollHeight equals clientHeight
    if (scrollHeight === clientHeight) {
      progressBar.style.width = '0%';
      return;
    }
    
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
  }

  // Initialize scroll-triggered animations
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-triggered');
    elements.forEach(element => {
      if (window.helpers.isInViewport(element)) {
        element.classList.add('visible');
      }
    });
  }

  // Handle scroll events
  window.addEventListener('scroll', function() {
    initScrollAnimations();
    updateScrollProgress(); // Update progress bar on scroll
  });

  // Initial check
  initScrollAnimations();
  updateScrollProgress(); // Initial calculation

  // Parallax effect
  window.helpers.initParallax();

  // Initialize rotating text
  window.helpers.initRotatingText();
});

// Text rotation class
class TxtRotate {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = period;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }

  tick() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => this.tick(), delta);
  }
} 