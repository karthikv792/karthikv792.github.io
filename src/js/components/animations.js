// Animation-related functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize GSAP animations
  function initGSAPAnimations() {
    // Hero section animations
    gsap.from('.titles1', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    });

    gsap.from('.titles2', {
      duration: 1,
      y: 50,
      opacity: 0,
      delay: 0.3,
      ease: 'power2.out'
    });

    gsap.from('.blink_me', {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.6,
      ease: 'power2.out'
    });

    // Scroll-triggered animations for sections
    gsap.utils.toArray('.scroll-triggered').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
      });
    });

    // Parallax effect for background images
    gsap.utils.toArray('.parallax-window').forEach(section => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * 0.3,
        ease: 'none'
      });
    });
  }

  // Initialize animations
  initGSAPAnimations();
}); 