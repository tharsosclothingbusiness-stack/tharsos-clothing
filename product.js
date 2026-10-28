import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const pdpContainer = document.getElementById('pdp-container');
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let selectedSize = null, currentProduct = null;

async function loadProduct() {
  if (!productId) { pdpContainer.innerHTML = '<h2>Product not found.</h2>'; return; }
  const docSnap = await getDoc(doc(db, "products", productId));
  if (docSnap.exists()) { currentProduct = docSnap.data(); renderProduct(currentProduct); } 
  else { pdpContainer.innerHTML = '<h2>Product not found.</h2>'; }
}

function renderProduct(product) {
  let priceHTML = `$${product.price}`;
  if (product.sale_price) priceHTML = `<span style="text-decoration: line-through; color: var(--muted); margin-right: 12px; font-size: 0.8em;">$${product.price}</span> <span style="color: var(--red); font-weight: 600;">$${product.sale_price}</span>`;

  let galleryHTML = '<div class="pdp-gallery-main"><img id="main-img" src="' + product.images[0] + '" alt="' + product.name + '"></div>';
  if (product.images.length > 1) {
    galleryHTML += '<div class="pdp-gallery-thumbs">';
    product.images.forEach((img, index) => { galleryHTML += `<img src="${img}" class="thumb ${index === 0 ? 'active' : ''}" data-src="${img}">`; });
    galleryHTML += '</div>';
  }

  let sizesHTML = '';
  if (product.sizes && Object.keys(product.sizes).length > 0) {
    sizesHTML = `<div class="size-selector">`;
    for (const [size, variantId] of Object.entries(product.sizes)) { sizesHTML += `<button class="size-btn" data-size="${size}" data-variant="${variantId}">${size}</button>`; }
    sizesHTML += `</div>`;
  } else { sizesHTML = `<p style="color: var(--red); font-size: 0.85rem;">No sizes available.</p>`; }

  pdpContainer.innerHTML = `
    <div class="pdp-images">${galleryHTML}</div>
    <div class="pdp-info">
      <a href="index.html" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 24px;">&larr; Back to Shop</a>
      <h1>${product.name}</h1>
      <p class="pdp-price">${priceHTML}</p>
      <div class="pdp-details"><p>${product.details || product.description}</p></div>
      <div class="pdp-action"><h3>Select Size</h3>${sizesHTML}<button id="add-to-cart-main" class="btn btn-solid btn-full" style="margin-top: 24px;" disabled>Select a Size</button></div>
    </div>
  `;

  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('main-img').src = thumb.dataset.src;
    });
  });

  const sizeBtns = document.querySelectorAll('.size-btn');
  const addToCartBtn = document.getElementById('add-to-cart-main');

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      const variantId = btn.dataset.variant;
      addToCartBtn.disabled = false;
      addToCartBtn.innerText = 'Add to Cart';

      addToCartBtn.onclick = () => {
        let cart = JSON.parse(localStorage.getItem('tharsos_cart')) || [];
        cart.push({ productId: productId, name: currentProduct.name, size: selectedSize, syncVariantId: variantId, price: currentProduct.sale_price || currentProduct.price, image: currentProduct.images[0] });
        localStorage.setItem('tharsos_cart', JSON.stringify(cart));
        addToCartBtn.innerText = 'Added!';
        document.getElementById('cartCount').innerText = cart.length;
        setTimeout(() => addToCartBtn.innerText = 'Add to Cart', 1500);
      };
    });
  });
}

loadProduct();
document.getElementById('cartCount').innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;

// Sidebar logic
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
wipTriggers.forEach(trigger => { trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } }); });
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
