document.addEventListener('DOMContentLoaded', () => {
  const filterContainer = document.getElementById('publication-filters');
  const publicationList = document.getElementById('publication-list');
  
  if (!filterContainer || !publicationList) return; // Exit if elements not found

  const filterButtons = filterContainer.querySelectorAll('.filter-btn');
  const publications = publicationList.querySelectorAll('li');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter publications
      publications.forEach(pub => {
        const year = pub.getAttribute('data-year');
        
        if (filterValue === 'all' || year === filterValue) {
          pub.classList.remove('hidden');
        } else {
          pub.classList.add('hidden');
        }
      });
    });
  });
}); 