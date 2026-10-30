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

// 2. Cart Logic
const cartContainer = document.getElementById('cart-items-container');
const summaryDiv = document.getElementById('cart-summary');
const totalPriceEl = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCountEl = document.getElementById('cartCount');
const termsCheck = document.getElementById('terms-check');

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

  // Re-apply checkbox state after re-render
  if (termsCheck) {
    checkoutBtn.disabled = !termsCheck.checked;
  }

  document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('tharsos_cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

// 3. Checkout Checkbox Validation
if (termsCheck) {
  termsCheck.addEventListener('change', (e) => {
    if (checkoutBtn) checkoutBtn.disabled = !e.target.checked;
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (termsCheck && termsCheck.checked) {
      // Proceed to Stripe Checkout logic
      alert("Terms accepted. Proceeding to secure checkout...");
      // window.location.href = "/checkout";
    } else {
      alert("You must agree to the Terms of Service to checkout.");
    }
  });
}

renderCart();

// 4. Standard UI Logic
const hamburger = document.getElementById('hamburger'), sidebar = document.getElementById('sidebar'), overlay = document.getElementById('overlay'), closeBtn = document.getElementById('closeSidebar'), body = document.body;
function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('open'); body.classList.add('no-scroll'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); body.classList.remove('no-scroll'); }
if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

const wipTriggers = document.querySelectorAll('.wip-trigger'), wipBanner = document.getElementById('wipBanner'), closeWipBtn = document.getElementById('closeWip');
wipTriggers.forEach(trigger => trigger.addEventListener('click', (e) => { e.preventDefault(); if(wipBanner) { wipBanner.classList.add('open'); body.classList.add('no-scroll'); closeSidebar(); } }));
if (closeWipBtn) closeWipBtn.addEventListener('click', () => { wipBanner.classList.remove('open'); body.classList.remove('no-scroll'); });
