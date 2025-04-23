// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarToggler = document.querySelector('.navbar-toggler');

  // Handle navbar collapse on mobile
  navbarToggler.addEventListener('click', function() {
    navbar.classList.toggle('navbar-expanded');
  });

  // Close navbar when clicking outside
  document.addEventListener('click', function(event) {
    if (!navbar.contains(event.target)) {
      navbar.classList.remove('navbar-expanded');
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = window.config.navigation.scrollOffset;
        const targetPosition = targetElement.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close navbar on mobile after clicking
        navbar.classList.remove('navbar-expanded');
      }
    });
  });

  // Add active class to current section in navbar
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - window.config.navigation.scrollOffset;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Initial check
}); 