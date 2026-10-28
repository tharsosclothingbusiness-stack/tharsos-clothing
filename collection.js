import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = { /* YOUR CONFIG */ apiKey: "AIzaSyAKYHT7H2fiixbgrvadNEj10yz5HlIEI1U", authDomain: "tharsos-af07d.firebaseapp.com", projectId: "tharsos-af07d", storageBucket: "tharsos-af07d.firebasestorage.app", messagingSenderId: "229266745261", appId: "1:229266745261:web:57b90fc331b098f1bda324" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const collectionName = urlParams.get('name');

if (!collectionName) {
  document.getElementById('collection-title').innerText = "Collection Not Found";
} else {
  document.getElementById('collection-title').innerText = collectionName;
  
  // Fetch Collection Info
  onSnapshot(collection(db, "collections"), (snapshot) => {
    snapshot.forEach(doc => {
      const c = doc.data();
      if (c.name === collectionName) {
        document.getElementById('collection-desc').innerText = c.description;
        // Optionally set background image to c.banner_image
      }
    });
  });

  // Fetch Products in this collection
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

// Cart counter & Sidebar logic (standard)
document.getElementById('cartCount').innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;
