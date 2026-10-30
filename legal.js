// 1. Cookie Banner Logic
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
if (!localStorage.getItem('tharsos_cookie_consent') && cookieBanner) {
  setTimeout(() => cookieBanner.classList.add('show'), 1000);
}
if (acceptCookiesBtn) {
  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('tharsos_cookie_consent', 'true');
    cookieBanner.classList.remove('show');
  });
}

// 2. Standard UI Logic
const cartCountEl = document.getElementById('cartCount');
if (cartCountEl) cartCountEl.innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;

const hamburger = document.getElementById('hamburger'), sidebar = document.getElementById('sidebar'), overlay = document.getElementById('overlay'), closeBtn = document.getElementById('closeSidebar'), body = document.body;
function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('open'); body.classList.add('no-scroll'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); body.classList.remove('no-scroll'); }
if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

const wipTriggers = document.querySelectorAll('.wip-trigger'), wipBanner = document.getElementById('wipBanner'), closeWipBtn = document.getElementById('closeWip');
wipTriggers.forEach(trigger => trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } }));
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
