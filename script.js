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

// Fetch Settings
onSnapshot(doc(db, "config", "site"), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const clearLinks = [document.getElementById('nav-clearance'), document.getElementById('side-clearance')];
    clearLinks.forEach(link => { if(link) link.style.display = data.showClearance ? 'block' : 'none'; });
    if (data.carouselImages && data.carouselImages.length > 0) {
      const heroBg = document.getElementById('hero-bg');
      if (heroBg) heroBg.innerHTML = `<img src="${data.carouselImages[0]}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }
  }
});

// Fetch Products
const productGrid = document.getElementById('product-grid');
if (productGrid) {
  onSnapshot(collection(db, "products"), (snapshot) => {
    productGrid.innerHTML = '';
    if (snapshot.empty) {
      productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--muted);">No products found.</p>';
      return;
    }

    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const docId = docSnap.id;
      let priceHTML = `$${product.price}`;
      if (product.sale_price) {
        priceHTML = `<span style="text-decoration: line-through; color: var(--muted); margin-right: 8px; font-size: 0.9em;">$${product.price}</span> <span style="color: var(--red); font-weight: 600;">$${product.sale_price}</span>`;
      }
      let buttonText = product.status === 'preorder' ? 'Pre-Order' : 'View Item';
      let badgeHTML = product.status === 'preorder' ? `<span style="display: inline-block; background: var(--text); color: #fff; font-size: 0.65rem; padding: 2px 6px; margin-bottom: 8px; letter-spacing: 0.1em;">PRE-ORDER</span>` : '';

      const productCard = document.createElement('article');
      productCard.className = 'product';
      productCard.innerHTML = `
        <a href="product.html?id=${docId}" style="display: block; margin-bottom: 24px;">
          <div class="img-ph img-ph-product" style="position: relative; overflow: hidden; margin-bottom: 0;">
            <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 2;">
          </div>
        </a>
        <div style="margin-bottom: 12px; min-height: 20px;">${badgeHTML}</div>
        <a href="product.html?id=${docId}"><h3>${product.name}</h3></a>
        <p class="desc">${product.description}</p>
        <p class="price">${priceHTML}</p>
        <a href="product.html?id=${docId}" class="btn btn-solid btn-full" style="text-align: center;">${buttonText}</a>
      `;
      productGrid.appendChild(productCard);
    });
  });
}

// Cart Count & Sidebar
function updateCartCount() {
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;
}
updateCartCount();

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

// WIP Banner
const wipTriggers = document.querySelectorAll('.wip-trigger');
const wipBanner = document.getElementById('wipBanner');
const closeWipBtn = document.getElementById('closeWip');
wipTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } });
});
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
