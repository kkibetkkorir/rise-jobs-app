// ===== Bottom Navigation Active State =====
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    // Don't remove active from center button if it's a link
    if (this.dataset.tab === 'post') return;

    // Remove active from all
    navItems.forEach((i) => i.classList.remove('active'));

    // Add active to clicked
    this.classList.add('active');

    // Update the badge if needed (just demo)
    if (this.dataset.tab === 'saved') {
      const badge = this.querySelector('.badge');
      if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
      }
    }
  });
});

// ===== Handle tab switching with URL params =====
(function checkTabFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');

  if (tab) {
    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.dataset.tab === tab) {
        item.classList.add('active');
      }
    });
  }
})();

// ===== Demo: Show notification badge on home =====
// You can dynamically update badges based on notifications
function updateBadge(tab, count) {
  navItems.forEach((item) => {
    if (item.dataset.tab === tab) {
      let badge = item.querySelector('.badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge';
        item.appendChild(badge);
      }
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  });
}

// Example: Update notifications badge
// updateBadge('notifications', 5);

console.log('✅ Bottom navigation ready.');
console.log('📌 Tabs: Home, Search, Post (center), Saved, Profile');
console.log(
  '💡 The center button is a call-to-action for posting jobs or applying.'
);
console.log('🔔 Saved jobs badge shows 3 by default (demo).');
