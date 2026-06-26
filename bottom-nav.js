/**
 * Rise Jobs - Bottom Navigation Manager
 * Handles active states, badges, and center button interactions
 */

(function() {
  'use strict';

  const bottomNav = document.getElementById('bottomNav');
  if (!bottomNav) {
    console.warn('Bottom nav not found');
    return;
  }

  const navItems = bottomNav.querySelectorAll('.nav-item');

  // ===== ACTIVE STATE MANAGEMENT =====
  function setActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navItems.forEach(item => {
      if (item.classList.contains('center-btn')) return;

      const href = item.getAttribute('href') || '';
      const tab = item.dataset.tab;

      // Check if this item matches current page
      let isActive = false;

      if (href.includes(currentPath)) {
        isActive = true;
      } else if (currentPath === 'index.html' && tab === 'home') {
        isActive = true;
      } else if (currentPath === 'search.html' && tab === 'search') {
        isActive = true;
      } else if (currentPath === 'account.html' && (tab === 'profile' || tab === 'saved')) {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'saved' && tab === 'saved') {
          isActive = true;
        } else if (!tabParam && tab === 'profile') {
          isActive = true;
        }
      }

      if (isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  setActiveState();

  // ===== CLICK HANDLER WITH RIPPLE =====
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Add click feedback animation
      this.style.transform = this.classList.contains('center-btn') ? 'scale(0.95)' : 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      // Haptic feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });
  });

  // ===== BADGE UPDATES =====
  window.updateBadge = function(tab, count) {
    navItems.forEach(item => {
      if (item.dataset.tab === tab) {
        let badge = item.querySelector('.badge');
        if (!badge && count > 0) {
          badge = document.createElement('span');
          badge.className = 'badge';
          item.appendChild(badge);
        }
        if (badge) {
          if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
          } else {
            badge.style.display = 'none';
          }
        }
      }
    });
  };

  // ===== LOAD SAVED JOBS COUNT =====
  function loadSavedJobsCount() {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      window.updateBadge('saved', savedJobs.length);
    } catch (e) {
      console.warn('Could not load saved jobs count');
    }
  }

  loadSavedJobsCount();

  // ===== HANDLE TAB FROM URL =====
  (function checkTabFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');

    if (tab) {
      navItems.forEach(item => {
        if (item.dataset.tab === tab) {
          item.classList.add('active');
        } else if (!item.classList.contains('center-btn')) {
          item.classList.remove('active');
        }
      });
    }
  })();

  console.log('Bottom navigation initialized');

})();
