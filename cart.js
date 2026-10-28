const cartContainer = document.getElementById('cart-items-container');
const summaryDiv = document.getElementById('cart-summary');
const totalPriceEl = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCountEl = document.getElementById('cartCount');

function renderCart() {
  let cart = JSON.parse(localStorage.getItem('tharsos_cart')) || [];
  if (cartCountEl) cartCountEl.innerText = cart.length;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">Your cart is empty. <a href="index.html" style="text-decoration: underline;">Continue shopping</a>.</p>';
    summaryDiv.style.display = 'none';
    return;
  }

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" class="cart-item-img">
      <div class="cart-item-info"><h3>${item.name}</h3><p>Size: ${item.size}</p><p>$${item.price}</p></div>
      <button class="cart-remove" data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(itemEl);
  });

  totalPriceEl.innerText = `$${total.toFixed(2)}`;
  summaryDiv.style.display = 'block';

  document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('tharsos_cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

checkoutBtn.addEventListener('click', () => { alert("Stripe Checkout will be integrated next!"); });
renderCart();

// Sidebar & WIP Logic
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
