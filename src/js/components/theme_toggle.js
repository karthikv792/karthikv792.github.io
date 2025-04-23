document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme on initial load
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    // Toggle the .dark-mode class on the body
    document.body.classList.toggle('dark-mode');

    // Determine the new theme
    let newTheme = 'light';
    if (document.body.classList.contains('dark-mode')) {
      newTheme = 'dark';
    }

    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme);
  });
}); 