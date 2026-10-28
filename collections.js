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

// 1. Fetch Global Settings (Clearance toggle)
onSnapshot(doc(db, "config", "site"), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const clearLinks = [document.getElementById('nav-clearance'), document.getElementById('side-clearance')];
    clearLinks.forEach(link => { if(link) link.style.display = data.showClearance ? 'block' : 'none'; });
  }
});

// 2. Fetch and Render Collections
const grid = document.getElementById('collections-grid');
onSnapshot(collection(db, "collections"), (snapshot) => {
  grid.innerHTML = '';
  
  if (snapshot.empty) {
    grid.innerHTML = '<p style="text-align: center; width: 100%; color: var(--muted);">No collections found.</p>';
    return;
  }

  snapshot.forEach(doc => {
    const col = doc.data();
    const card = document.createElement('a');
    // Link to the new dedicated collection page
    card.href = `collection.html?name=${encodeURIComponent(col.name)}`; 
    card.className = 'collection-card';
    card.innerHTML = `
      <div class="collection-image" style="background-image: url('${col.banner_image}')"></div>
      <div class="collection-info">
        <h3>${col.name}</h3>
        <p>${col.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
});

// 3. Cart Counter
function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (el) el.innerText = (JSON.parse(localStorage.getItem('tharsos_cart')) || []).length;
}
updateCartCount();

// 4. Sidebar & WIP Logic
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
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
