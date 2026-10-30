import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// 2. Fetch Products Logic
const urlParams = new URLSearchParams(window.location.search);
const collectionName = urlParams.get('name');

if (!collectionName) {
  document.getElementById('collection-title').innerText = "Collection Not Found";
} else {
  document.getElementById('collection-title').innerText = collectionName;
  
  onSnapshot(collection(db, "collections"), (snapshot) => {
    snapshot.forEach(doc => {
      const c = doc.data();
      if (c.name === collectionName) {
        document.getElementById('collection-desc').innerText = c.description;
      }
    });
  });

  onSnapshot(collection(db, "products"), (snapshot) => {
    const grid = document.getElementById('collection-products-grid');
    grid.innerHTML = '';
    let count = 0;

    snapshot.forEach(docSnap => {
      const product = docSnap.data();
      const docId = docSnap.id;

      if (product.collection === collectionName) {
        count++;
        const card = document.createElement('article');
        card.className = 'product';
        card.innerHTML = `
          <a href="product.html?id=${docId}">
            <div class="img-ph img-ph-product"><img src="${product.images[0]}" style="width: 100%; height: 100%; object-fit: cover;"></div>
          </a>
          <h3>${product.name}</h3>
          <p class="price">$${product.sale_price || product.price}</p>
          <a href="product.html?id=${docId}" class="btn btn-solid btn-full" style="text-align: center;">View Item</a>
        `;
        grid.appendChild(card);
      }
    });
    if (count === 0) grid.innerHTML = '<p style="text-align: center; width: 100%; color: var(--muted);">No products in this collection yet.</p>';
  });
}

// 3. Standard UI Logic
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
