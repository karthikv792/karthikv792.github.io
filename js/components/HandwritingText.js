/**
 * Handwriting Text Component
 * Simulates handwriting animation with letter-by-letter reveal
 * 
 * Usage:
 * new HandwritingText(element, ['Word1', 'Word2'], options);
 */

class HandwritingText {
  constructor(element, words = [], options = {}) {
    this.element = element;
    this.words = words.length ? words : this.parseWordsFromElement();
    this.currentIndex = 0;
    this.isAnimating = false;
    this.timeoutId = null;
    this.letterTimeouts = [];

    this.options = {
      letterDelay: 80,        // ms between letters
      holdDuration: 2500,     // ms to hold completed word
      eraseDuration: 600,     // ms to erase word
      loop: true,
      cursorChar: '|',
      showCursor: true,
      ...options
    };

    // Create wrapper structure
    this.wrapper = null;
    this.textSpan = null;
    this.cursorSpan = null;

    if (this.words.length) {
      this.init();
    }
  }

  parseWordsFromElement() {
    const dataRotate = this.element.dataset.rotate;
    if (dataRotate) {
      try {
        return JSON.parse(dataRotate);
      } catch (e) {
        console.warn('Could not parse data-rotate:', e);
      }
    }
    return [this.element.textContent];
  }

  init() {
    // Set up element structure
    this.element.innerHTML = '';
    this.element.style.display = 'inline-block';
    this.element.style.minWidth = '200px';
    this.element.style.fontFamily = "'Sacramento', cursive";
    
    this.wrapper = document.createElement('span');
    this.wrapper.className = 'handwriting-wrapper';
    
    this.textSpan = document.createElement('span');
    this.textSpan.className = 'handwriting-text';
    
    this.cursorSpan = document.createElement('span');
    this.cursorSpan.className = 'handwriting-cursor';
    this.cursorSpan.textContent = this.options.cursorChar;
    
    this.wrapper.appendChild(this.textSpan);
    if (this.options.showCursor) {
      this.wrapper.appendChild(this.cursorSpan);
    }
    this.element.appendChild(this.wrapper);

    // Add styles
    this.injectStyles();
    
    // Start animation
    this.animateWord();
  }

  injectStyles() {
    if (document.getElementById('handwriting-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'handwriting-styles';
    styles.textContent = `
      .handwriting-wrapper {
        display: inline-flex;
        align-items: baseline;
      }

      .handwriting-text {
        font-family: 'Sacramento', cursive;
      }

      .handwriting-cursor {
        display: inline-block;
        font-family: 'Sacramento', cursive;
        color: var(--color-accent, #8C1515);
        animation: handwriting-blink 0.6s ease-in-out infinite;
        margin-left: 2px;
        font-weight: normal;
      }

      @keyframes handwriting-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      .handwriting-letter {
        display: inline-block;
        opacity: 0;
        transform: translateY(10px) rotate(-5deg);
        animation: handwriting-appear 0.3s ease-out forwards;
        color: var(--color-accent, #8C1515);
        font-family: 'Sacramento', cursive;
      }

      @keyframes handwriting-appear {
        0% {
          opacity: 0;
          transform: translateY(10px) rotate(-5deg) scale(0.8);
        }
        60% {
          opacity: 1;
          transform: translateY(-2px) rotate(2deg) scale(1.05);
        }
        100% {
          opacity: 1;
          transform: translateY(0) rotate(0) scale(1);
        }
      }

      .handwriting-letter.erase {
        animation: handwriting-disappear 0.15s ease-in forwards;
      }

      @keyframes handwriting-disappear {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-10px) scale(0.8);
        }
      }
    `;
    document.head.appendChild(styles);
  }

  animateWord() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const word = this.words[this.currentIndex];
    this.textSpan.innerHTML = '';

    // Write each letter with delay
    let delay = 0;
    const letters = word.split('');

    letters.forEach((letter, index) => {
      const timeout = setTimeout(() => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'handwriting-letter';
        letterSpan.textContent = letter === ' ' ? '\u00A0' : letter;
        letterSpan.style.animationDelay = '0ms';
        this.textSpan.appendChild(letterSpan);

        // Add slight ink effect on some letters
        if (Math.random() > 0.7) {
          letterSpan.style.fontWeight = '500';
        }
      }, delay);

      this.letterTimeouts.push(timeout);
      
      // Vary the delay slightly for natural feel
      delay += this.options.letterDelay + (Math.random() * 30 - 15);
    });

    // After word is complete, wait then erase
    const totalWriteTime = delay + 300;
    
    this.timeoutId = setTimeout(() => {
      this.eraseWord();
    }, totalWriteTime + this.options.holdDuration);
  }

  eraseWord() {
    const letters = this.textSpan.querySelectorAll('.handwriting-letter');
    const letterArray = Array.from(letters).reverse();

    let delay = 0;
    letterArray.forEach((letter, index) => {
      const timeout = setTimeout(() => {
        letter.classList.add('erase');
        setTimeout(() => letter.remove(), 150);
      }, delay);

      this.letterTimeouts.push(timeout);
      delay += 40; // Faster erase than write
    });

    // Move to next word
    this.timeoutId = setTimeout(() => {
      this.isAnimating = false;
      this.currentIndex = (this.currentIndex + 1) % this.words.length;
      
      if (this.options.loop || this.currentIndex !== 0) {
        this.animateWord();
      }
    }, delay + 200);
  }

  stop() {
    this.letterTimeouts.forEach(t => clearTimeout(t));
    this.letterTimeouts = [];
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isAnimating = false;
  }

  destroy() {
    this.stop();
    if (this.element) {
      this.element.innerHTML = this.words[0] || '';
    }
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.HandwritingText = HandwritingText;
}
