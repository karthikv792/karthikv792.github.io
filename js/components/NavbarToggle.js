/**
 * Navbar Toggle Component
 * Vanilla replacement for Bootstrap 4's collapse plugin.
 * Toggles `.show` on the target collapse element and keeps aria-expanded in sync.
 */

class NavbarToggle {
  constructor(options = {}) {
    this.options = {
      togglerSelector: '.navbar-toggler',
      collapseSelector: '#navbarSupportedContent',
      ...options
    };

    this.toggler = document.querySelector(this.options.togglerSelector);
    this.collapse = document.querySelector(this.options.collapseSelector);

    if (this.toggler && this.collapse) {
      this.init();
    }
  }

  init() {
    this.onToggle = this.toggle.bind(this);
    this.onDocClick = this.handleOutsideClick.bind(this);
    this.onKeydown = this.handleKeydown.bind(this);

    this.toggler.addEventListener('click', this.onToggle);
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('keydown', this.onKeydown);
  }

  isOpen() {
    return this.collapse.classList.contains('show');
  }

  open() {
    this.collapse.classList.add('show');
    this.toggler.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.collapse.classList.remove('show');
    this.toggler.setAttribute('aria-expanded', 'false');
  }

  toggle(e) {
    if (e) e.stopPropagation();
    this.isOpen() ? this.close() : this.open();
  }

  handleOutsideClick(e) {
    if (!this.isOpen()) return;
    if (this.collapse.contains(e.target) || this.toggler.contains(e.target)) return;
    this.close();
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
      this.toggler.focus();
    }
  }

  destroy() {
    this.toggler.removeEventListener('click', this.onToggle);
    document.removeEventListener('click', this.onDocClick);
    document.removeEventListener('keydown', this.onKeydown);
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.NavbarToggle = NavbarToggle;
}
