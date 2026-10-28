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
const cartCountEl = document.getElementById('cartCount');
let selectedSize = null;
let currentProduct = null;

// Get Product ID from URL (e.g., product.html?id=abc123)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function loadProduct() {
  if (!productId) {
    pdpContainer.innerHTML = '<h2>Product not found.</h2><a href="index.html" class="btn btn-solid">Return to Shop</a>';
    return;
  }

  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      currentProduct = docSnap.data();
      renderProduct(currentProduct);
    } else {
      pdpContainer.innerHTML = '<h2>Product not found.</h2>';
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    pdpContainer.innerHTML = '<h2>Error loading product.</h2>';
  }
}

function renderProduct(product) {
  let priceHTML = `$${product.price}`;
  if (product.sale_price) {
    priceHTML = `<span style="text-decoration: line-through; color: var(--muted); margin-right: 12px; font-size: 0.8em;">$${product.price}</span> <span style="color: var(--red); font-weight: 600;">$${product.sale_price}</span>`;
  }

  // Build Size Buttons
  let sizesHTML = '';
  if (product.sizes && Object.keys(product.sizes).length > 0) {
    sizesHTML = `<div class="size-selector">`;
    for (const [size, variantId] of Object.entries(product.sizes)) {
      sizesHTML += `<button class="size-btn" data-size="${size}" data-variant="${variantId}">${size}</button>`;
    }
    sizesHTML += `</div>`;
  } else {
    sizesHTML = `<p style="color: var(--red); font-size: 0.85rem;">No sizes available for this item.</p>`;
  }

  pdpContainer.innerHTML = `
    <div class="pdp-image">
      <img src="${product.image_url}" alt="${product.name}">
    </div>
    <div class="pdp-info">
      <a href="index.html" style="font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 24px;">&larr; Back to Shop</a>
      <h1>${product.name}</h1>
      <p class="pdp-price">${priceHTML}</p>
      
      <div class="pdp-details">
        <p>${product.details || product.description}</p>
      </div>

      <div class="pdp-action">
        <h3>Select Size</h3>
        ${sizesHTML}
        <button id="add-to-cart-main" class="btn btn-solid btn-full" style="margin-top: 24px;" disabled>Select a Size</button>
      </div>
    </div>
  `;

  setupSizeSelector();
}

function setupSizeSelector() {
  const sizeBtns = document.querySelectorAll('.size-btn');
  const addToCartBtn = document.getElementById('add-to-cart-main');

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      sizeBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      
      selectedSize = btn.dataset.size;
      const variantId = btn.dataset.variant;

      // Enable add to cart
      addToCartBtn.disabled = false;
      addToCartBtn.innerText = 'Add to Cart';

      // Handle cart click
      addToCartBtn.onclick = () => {
        let cart = JSON.parse(localStorage.getItem('tharsos_cart')) || [];
        cart.push({
          productId: productId,
          name: currentProduct.name,
          size: selectedSize,
          syncVariantId: variantId,
          price: currentProduct.sale_price || currentProduct.price
        });
        localStorage.setItem('tharsos_cart', JSON.stringify(cart));
        
        // Update UI
        addToCartBtn.innerText = 'Added!';
        updateCartCount();
        
        setTimeout(() => {
          addToCartBtn.innerText = 'Add to Cart';
        }, 1500);
      };
    });
  });
}

function updateCartCount() {
  if (cartCountEl) {
    const cart = JSON.parse(localStorage.getItem('tharsos_cart')) || [];
    cartCountEl.innerText = cart.length;
  }
}

// Init
loadProduct();
updateCartCount();
