import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
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

// ==========================================
// 2. DYNAMIC PRODUCT RENDERING (Shop Page Only)
// ==========================================
const productGrid = document.getElementById('product-grid');

if (productGrid) {
  onSnapshot(collection(db, "products"), (snapshot) => {
    productGrid.innerHTML = '';

    if (snapshot.empty) {
      productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--muted);">No products found. Add some in the Admin Portal.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const product = doc.data();
      
      // Sale Price Logic
      let priceHTML = `$${product.price}`;
      if (product.sale_price) {
        priceHTML = `<span style="text-decoration: line-through; color: var(--muted); margin-right: 8px; font-size: 0.9em;">$${product.price}</span> <span style="color: var(--red); font-weight: 600;">$${product.sale_price}</span>`;
      }

      // Pre-order Logic
      let buttonText = product.status === 'preorder' ? 'Pre-Order' : 'Add to cart';
      let badgeHTML = product.status === 'preorder' ? `<span style="display: inline-block; background: var(--text); color: #fff; font-size: 0.65rem; padding: 2px 6px; margin-bottom: 8px; letter-spacing: 0.1em;">PRE-ORDER</span>` : '';

      const productCard = document.createElement('article');
      productCard.className = 'product';
      productCard.innerHTML = `
        <div class="img-ph img-ph-product" style="position: relative; overflow: hidden;">
          <img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 2;">
        </div>
        <div style="margin-bottom: 12px; min-height: 20px;">${badgeHTML}</div>
        <h3>${product.name}</h3>
        <p class="desc">${product.description}</p>
        <p class="price">${priceHTML}</p>
        <button class="btn btn-solid btn-full add-to-cart-btn" data-name="${product.name}">${buttonText}</button>
      `;
      
      productGrid.appendChild(productCard);
    });
  });

  // Cart Logic (Event Delegation)
  const cartCountEl = document.getElementById('cartCount');
  let cartCount = 0;

  productGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const btn = e.target;
      cartCount++;
      if (cartCountEl) cartCountEl.innerText = cartCount;
      
      const originalText = btn.innerText;
      btn.innerText = 'Added';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
      }, 1200);
    }
  });
}

// ==========================================
// 3. LAYOUT TOGGLE LOGIC (A vs B)
// ==========================================
const layoutButtons = document.querySelectorAll('[data-layout]');

function setLayout(layout) {
  document.documentElement.setAttribute('data-layout', layout);
  try { localStorage.setItem('layout', layout); } catch (e) {}
  layoutButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-layout') === layout);
  });
  if (layout === 'b' && window.innerWidth >= 768) closeSidebar();
}

layoutButtons.forEach(btn => {
  btn.addEventListener('click', () => setLayout(btn.getAttribute('data-layout')));
});

// ==========================================
// 4. SIDEBAR & WIP LOGIC
// ==========================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeSidebar');
const body = document.body;

function openSidebar() {
  if(!sidebar) return;
  sidebar.classList.add('open');
  overlay.classList.add('open');
  if(hamburger) hamburger.setAttribute('aria-expanded', 'true');
  body.classList.add('no-scroll');
}

function closeSidebar() {
  if(!sidebar) return;
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  if(hamburger) hamburger.setAttribute('aria-expanded', 'false');
  body.classList.remove('no-scroll');
}

if (hamburger) hamburger.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) closeSidebar(); else openSidebar();
});
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

// Work in Progress Banner
const wipTriggers = document.querySelectorAll('.wip-trigger');
const wipBanner = document.getElementById('wipBanner');
const closeWipBtn = document.getElementById('closeWip');

wipTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if(wipBanner) {
      wipBanner.classList.add('open');
      body.classList.add('no-scroll');
      closeSidebar();
    }
  });
});

if (closeWipBtn) {
  closeWipBtn.addEventListener('click', () => {
    wipBanner.classList.remove('open');
    body.classList.remove('no-scroll');
  });
}

// ==========================================
// 5. INITIALIZE LAYOUT
// ==========================================
let saved = 'b';
try { saved = localStorage.getItem('layout') || 'b'; } catch (e) {}
setLayout(saved);
