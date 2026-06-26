/**
 * Rise Jobs - Theme Manager
 * Handles dark/light mode toggle with localStorage persistence
 */

(function() {
  'use strict';

  // Theme constants
  const THEME_KEY = 'rise_theme';
  const DARK_MODE = 'dark';
  const LIGHT_MODE = 'light';

  // Get the current theme from localStorage or system preference
  function getStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_MODE;
    }
    return LIGHT_MODE;
  }

  // Apply theme to the document
  function applyTheme(theme) {
    const body = document.body;

    if (theme === DARK_MODE) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === DARK_MODE ? '#0f172a' : '#0b1a2f');
    }

    // Update toggle icon if present
    updateToggleIcon(theme);

    // Store preference
    localStorage.setItem(THEME_KEY, theme);
  }

  // Update the toggle button icon
  function updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    if (theme === DARK_MODE) {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      `;
      toggleBtn.title = 'Switch to light mode';
    } else {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      `;
      toggleBtn.title = 'Switch to dark mode';
    }
  }

  // Toggle between dark and light mode
  function toggleTheme() {
    const currentTheme = getStoredTheme();
    const newTheme = currentTheme === DARK_MODE ? LIGHT_MODE : DARK_MODE;
    applyTheme(newTheme);

    // Add a subtle animation feedback
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        toggleBtn.style.transform = '';
      }, 300);
    }
  }

  // Initialize theme on page load
  function initTheme() {
    const theme = getStoredTheme();
    applyTheme(theme);

    // Set up toggle button listener
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a preference
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? DARK_MODE : LIGHT_MODE);
        }
      });
    }
  }

  // Apply theme immediately to prevent flash
  // This runs before DOM is ready
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === DARK_MODE) {
    document.documentElement.classList.add('dark-mode-preload');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Expose toggle function globally
  window.toggleTheme = toggleTheme;
  window.getTheme = getStoredTheme;
  window.applyTheme = applyTheme;

})();

console.log('Theme manager loaded');
