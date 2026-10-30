import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKYHT7H2fiixbgrvadNEj10yz5HlIEI1U",
  authDomain: "tharsos-af07d.firebaseapp.com",
  projectId: "tharsos-af07d",
  storageBucket: "tharsos-af07d.firebasestorage.app",
  messagingSenderId: "229266745261",
  appId: "1:229266745261:web:57b90fc331b098f1bda324"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// 2. Fetch Settings
onSnapshot(doc(db, "config", "site"), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const clearLinks = [document.getElementById('nav-clearance'), document.getElementById('side-clearance')];
    clearLinks.forEach(link => { if(link) link.style.display = data.showClearance ? 'block' : 'none'; });
  }
});

// 3. Fetch Collections
const grid = document.getElementById('collections-grid');
onSnapshot(collection(db, "collections"), (snapshot) => {
  grid.innerHTML = '';
  if (snapshot.empty) return grid.innerHTML = '<p style="text-align: center; width: 100%; color: var(--muted);">No collections found.</p>';
  snapshot.forEach(doc => {
    const col = doc.data();
    const card = document.createElement('a');
    card.href = `collection.html?name=${encodeURIComponent(col.name)}`; 
    card.className = 'collection-card';
    card.innerHTML = `
      <div class="collection-image" style="background-image: url('${col.banner_image}')"></div>
      <div class="collection-info"><h3>${col.name}</h3><p>${col.description}</p></div>
    `;
    grid.appendChild(card);
  });
});

// 4. Standard UI Logic
document.getElementById('cartCount').innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;
const hamburger = document.getElementById('hamburger'), sidebar = document.getElementById('sidebar'), overlay = document.getElementById('overlay'), closeBtn = document.getElementById('closeSidebar'), body = document.body;
function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('open'); body.classList.add('no-scroll'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); body.classList.remove('no-scroll'); }
if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

const wipTriggers = document.querySelectorAll('.wip-trigger'), wipBanner = document.getElementById('wipBanner'), closeWipBtn = document.getElementById('closeWip');
wipTriggers.forEach(trigger => trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } }));
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
