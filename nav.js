// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', function () {
  mobileMenu.classList.toggle('open');
  this.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

// Close mobile menu on outside click
document.addEventListener('click', function (e) {
  const nav = document.getElementById('navbar');
  if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    menuToggle.textContent = '☰';
  }
});

// ===== User Authentication State (demo toggle) =====
// To show logged-in state, uncomment the avatar and hide the auth buttons
// You can toggle this based on your auth logic
const isLoggedIn = false; // Set to true to show logged-in state

if (isLoggedIn) {
  const actions = document.querySelector('.nav-actions');
  const avatar = document.createElement('img');
  avatar.src =
    'https://ui-avatars.com/api/?name=John+Doe&background=0b1a2f&color=fff&size=36';
  avatar.alt = 'User';
  avatar.className = 'user-avatar';
  avatar.onclick = () => (window.location.href = 'account.html');
  actions.appendChild(avatar);

  // Hide auth buttons
  actions.querySelector('.btn-outline').style.display = 'none';
  actions.querySelector('.btn-primary').style.display = 'none';

  // Update mobile menu
  const mobileActions = document.querySelector('.mobile-actions');
  mobileActions.innerHTML = `
            <a href="account.html" class="btn-primary-mobile" style="flex:1;text-align:center;padding:10px;border-radius:40px;font-weight:600;font-size:0.85rem;background:#0b1a2f;color:white;border:none;text-decoration:none;">My Account</a>
            <a href="#" class="btn-outline-mobile" style="flex:1;text-align:center;padding:10px;border-radius:40px;font-weight:600;font-size:0.85rem;background:transparent;border:1px solid #dce5ef;color:#0b1a2f;text-decoration:none;" onclick="alert('Signed out!'); location.reload();">Sign Out</a>
        `;
}

console.log(
  '✅ Navigation ready. Add your job list content below the navigation.'
);
console.log('📌 Tip: Set isLoggedIn = true to see logged-in state.');
