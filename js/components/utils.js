/**
 * Utility Functions
 * Reusable helper functions for all components
 */

const Utils = {
  /**
   * Debounce function - delays execution until after wait period
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function - limits execution rate
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum time between calls in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} el - Element to check
   * @param {number} offset - Optional offset in pixels
   * @returns {boolean}
   */
  isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= offset
    );
  },

  /**
   * Get random character from string
   * @param {string} chars - String of possible characters
   * @returns {string} Random character
   */
  randomChar(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
  },

  /**
   * Split text into spans for animation
   * @param {HTMLElement} element - Element containing text
   * @param {string} type - 'chars' | 'words' | 'lines'
   * @returns {HTMLElement[]} Array of span elements
   */
  splitText(element, type = 'words') {
    const text = element.textContent;
    element.innerHTML = '';
    
    if (type === 'chars') {
      return [...text].map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        element.appendChild(span);
        return span;
      });
    }
    
    if (type === 'words') {
      return text.split(' ').map((word, index, arr) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        element.appendChild(span);
        if (index < arr.length - 1) {
          element.appendChild(document.createTextNode(' '));
        }
        return span;
      });
    }
    
    return [element];
  },

  /**
   * Lerp (linear interpolation)
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} amount - Interpolation amount (0-1)
   * @returns {number}
   */
  lerp(start, end, amount) {
    return start + (end - start) * amount;
  },

  /**
   * Clamp value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum
   * @param {number} max - Maximum
   * @returns {number}
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Map value from one range to another
   * @param {number} value - Input value
   * @param {number} inMin - Input range min
   * @param {number} inMax - Input range max
   * @param {number} outMin - Output range min
   * @param {number} outMax - Output range max
   * @returns {number}
   */
  mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  /**
   * Get element's position relative to document
   * @param {HTMLElement} el - Element
   * @returns {{top: number, left: number}}
   */
  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  },

  /**
   * Smooth scroll to element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} offset - Offset from top
   */
  scrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const top = this.getOffset(element).top - offset;
    
    if (typeof gsap !== 'undefined' && gsap.to) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: top, autoKill: true },
        ease: 'power3.out'
      });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        return false;
      }
    }
  },

  /**
   * Create element with attributes
   * @param {string} tag - Tag name
   * @param {Object} attrs - Attributes
   * @param {string|HTMLElement[]} content - Content
   * @returns {HTMLElement}
   */
  createElement(tag, attrs = {}, content = '') {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class' || key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('data')) {
        el.dataset[key.replace('data', '').toLowerCase()] = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    if (typeof content === 'string') {
      el.textContent = content;
    } else if (Array.isArray(content)) {
      content.forEach(child => el.appendChild(child));
    } else if (content instanceof HTMLElement) {
      el.appendChild(content);
    }
    return el;
  },

  /**
   * Wait for specified milliseconds
   * @param {number} ms - Milliseconds
   * @returns {Promise}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Extract year from text (for publications)
   * @param {string} text - Text to search
   * @returns {string|null}
   */
  extractYear(text) {
    const match = text.match(/20[0-9]{2}/);
    return match ? match[0] : null;
  },

  /**
   * Generate unique ID
   * @param {string} prefix - Optional prefix
   * @returns {string}
   */
  uid(prefix = 'uid') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}
