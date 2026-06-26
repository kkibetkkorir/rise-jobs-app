/**
 * Rise Jobs - Navigation Manager
 * Handles mobile menu, auth state, and navigation interactions
 */

(function() {
  'use strict';

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navbar = document.getElementById('navbar');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      this.textContent = isOpen ? '✕' : '☰';
      this.setAttribute('aria-expanded', isOpen);

      // Add/remove body scroll lock on mobile
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
      if (navbar && !navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      menuToggle.textContent = '☰';
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // ===== NAVBAR SCROLL EFFECT =====
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (navbar) {
      if (currentScroll > 10) {
        navbar.classList.add('scrolled', 'header-shadow');
      } else {
        navbar.classList.remove('scrolled', 'header-shadow');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ===== ACTIVE NAV LINK =====
  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath) {
        link.classList.add('active');
      } else if (linkPath !== '#' && linkPath !== '') {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

  // ===== USER AUTHENTICATION STATE =====
  // Check for stored auth data
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  function updateAuthUI() {
    const actionsContainer = document.querySelector('.nav-actions');
    const mobileActions = document.querySelector('.mobile-actions');

    if (!actionsContainer) return;

    if (isLoggedIn && userData.name) {
      // Create user avatar element
      const avatarUrl = userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0b1a2f&color=fff&size=36`;

      // Hide sign-in/sign-up buttons
      const signInBtn = actionsContainer.querySelector('.btn-outline');
      const signUpBtn = actionsContainer.querySelector('.btn-primary');

      if (signInBtn) signInBtn.style.display = 'none';
      if (signUpBtn) signUpBtn.style.display = 'none';

      // Create user avatar
      let existingAvatar = actionsContainer.querySelector('.user-avatar');
      if (!existingAvatar) {
        const avatar = document.createElement('img');
        avatar.src = avatarUrl;
        avatar.alt = userData.name;
        avatar.className = 'user-avatar';
        avatar.title = 'My Account';
        avatar.onclick = () => window.location.href = 'account.html';
        avatar.setAttribute('role', 'button');
        avatar.setAttribute('tabindex', '0');
        avatar.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.location.href = 'account.html';
          }
        });
        actionsContainer.insertBefore(avatar, actionsContainer.firstChild);
      }

      // Update mobile menu
      if (mobileActions) {
        mobileActions.innerHTML = `
          <a href="account.html" class="btn-primary-mobile" style="flex:1;text-align:center;padding:10px;border-radius:40px;font-weight:600;font-size:0.85rem;background:#0b1a2f;color:white;border:none;text-decoration:none;">
            My Account
          </a>
          <a href="#" class="btn-outline-mobile" style="flex:1;text-align:center;padding:10px;border-radius:40px;font-weight:600;font-size:0.85rem;background:transparent;border:1px solid #dce5ef;color:#0b1a2f;text-decoration:none;" onclick="signOut(event);">
            Sign Out
          </a>
        `;
      }
    } else {
      // Show sign-in/sign-up buttons
      const signInBtn = actionsContainer.querySelector('.btn-outline');
      const signUpBtn = actionsContainer.querySelector('.btn-primary');

      if (signInBtn) signInBtn.style.display = '';
      if (signUpBtn) signUpBtn.style.display = '';

      // Remove user avatar if exists
      const existingAvatar = actionsContainer.querySelector('.user-avatar');
      if (existingAvatar) {
        existingAvatar.remove();
      }
    }
  }

  updateAuthUI();

  // ===== SIGN OUT FUNCTION =====
  window.signOut = function(e) {
    e.preventDefault();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userEmail');
    localStorage.removeItem('rise_user_token');
    window.location.reload();
  };

  // ===== KEYBOARD NAVIGATION =====
  document.addEventListener('keydown', function(e) {
    // Tab navigation within mobile menu
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      const focusableElements = mobileMenu.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // ===== ANIMATIONS ON SCROLL =====
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate
  document.querySelectorAll('.card, .job-card').forEach(el => {
    animateOnScroll.observe(el);
  });

  console.log('Navigation initialized');

})();
