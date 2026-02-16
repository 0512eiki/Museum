const CART_KEY = 'museumCartV1';

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateQtyBadges(cart) {
  const cards = document.querySelectorAll('.souvenir-item');
  cards.forEach(card => {
    const id = card.getAttribute('data-itemid');
    const badge = card.querySelector('.qty-badge');
    if (!badge) return;
    const item = cart.find(it => it.id === id);
    badge.textContent = item ? `Qty: ${item.qty}` : '';
  });
}

function addToCart(btn) {
  const id = btn.dataset.id;
  const name = btn.dataset.name;
  const unitPrice = Number(btn.dataset.price);
  const image = btn.dataset.image;

  let cart = readCart();
  const idx = cart.findIndex(it => it.id === id);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id, name, unitPrice, qty: 1, image });
  }
  writeCart(cart);
  updateQtyBadges(cart);
}

function openModal(imgEl) {
  const large = imgEl.getAttribute('data-large') || imgEl.src;
  const parent = imgEl.closest('.souvenir-item');
  const title = parent ? parent.getAttribute('data-title') : '';
  const modal = document.getElementById('itemModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  if (!modal || !modalImage || !modalCaption) return;
  modalImage.src = large;
  modalImage.alt = imgEl.alt || title;
  modalCaption.textContent = title || '';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}

function closeModal() {
  const modal = document.getElementById('itemModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

function initShop() {
  const cart = readCart();
  updateQtyBadges(cart);

  document.querySelectorAll('.souvenir-item img').forEach(img => {
    img.addEventListener('click', () => openModal(img));
  });

  const modal = document.getElementById('itemModal');
  if (modal) {
    modal.addEventListener('click', function(e){
      if (e.target === this) closeModal();
    });
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', initShop);
