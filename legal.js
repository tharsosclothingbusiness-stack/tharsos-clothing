// 1. COOKIE BANNER LOGIC
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');

// Check if user has already accepted
const hasAcceptedCookies = localStorage.getItem('tharsos_cookie_consent');

if (!hasAcceptedCookies && cookieBanner) {
  // Show banner after a short delay for smoothness
  setTimeout(() => {
    cookieBanner.classList.add('show');
  }, 1000);
}

if (acceptCookiesBtn) {
  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('tharsos_cookie_consent', 'true');
    cookieBanner.classList.remove('show');
    
    // In the future, you would load your tracking scripts here:
    // loadGoogleAnalytics(); 
  });
}

// 2. SIDEBAR & WIP LOGIC (Standard)
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeSidebar');
const body = document.body;

function openSidebar() { if(!sidebar) return; sidebar.classList.add('open'); overlay.classList.add('open'); if(hamburger) hamburger.setAttribute('aria-expanded', 'true'); body.classList.add('no-scroll'); }
function closeSidebar() { if(!sidebar) return; sidebar.classList.remove('open'); overlay.classList.remove('open'); if(hamburger) hamburger.setAttribute('aria-expanded', 'false'); body.classList.remove('no-scroll'); }

if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

const wipTriggers = document.querySelectorAll('.wip-trigger');
const wipBanner = document.getElementById('wipBanner');
const closeWipBtn = document.getElementById('closeWip');
wipTriggers.forEach(trigger => { trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } }); });
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });

// Cart count placeholder
document.getElementById('cartCount').innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;
