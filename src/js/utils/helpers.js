// Utility functions for the website

// Function to check if an element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to add scroll-triggered animation class
function addScrollAnimation(element) {
  if (isInViewport(element)) {
    element.classList.add('scroll-triggered');
  }
}

// Function to initialize parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-window');
  parallaxElements.forEach(element => {
    new Parallax(element);
  });
}

// Function to initialize rotating text
function initRotatingText() {
  const elements = document.querySelectorAll('.txt-rotate');
  elements.forEach(element => {
    const dataRotate = element.getAttribute('data-rotate');
    const period = element.getAttribute('data-period');
    if (dataRotate) {
      const toRotate = JSON.parse(dataRotate);
      const period = parseInt(element.getAttribute('data-period'), 10) || 2000;
      new TxtRotate(element, toRotate, period);
    }
  });
}

// Export functions
window.helpers = {
  isInViewport,
  addScrollAnimation,
  initParallax,
  initRotatingText
}; 