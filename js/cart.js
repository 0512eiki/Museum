const CART_KEY = 'museumCartV1';
const TAX_RATE = 0.102;
const MEMBER_DISCOUNT_RATE = 0.15;
const SHIPPING_RATE = 25.00;
const VOLUME_DISCOUNT_TIERS = [
  { min: 0, max: 49.99, rate: 0 },
  { min: 50, max: 99.99, rate: 0.05 },
  { min: 100, max: 199.99, rate: 0.10 },
  { min: 200, max: Number.POSITIVE_INFINITY, rate: 0.15 }
];

function render() {
  let cart;
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { cart = []; }

  cart = cart.filter(it => it.unitPrice > 0 && it.qty > 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const cartContainer = document.getElementById('cartContainer');
  const summaryContainer = document.getElementById('summaryContainer');
  const memberCheckbox = document.getElementById('memberDiscount');
  const clearBtn = document.getElementById('clearCart');

  const memberChecked = memberCheckbox ? memberCheckbox.checked : false;

  let itemTotal = 0;
  cart.forEach(it => { itemTotal += it.unitPrice * it.qty; });

  let volumeRate = 0;
  for (let i = 0; i < VOLUME_DISCOUNT_TIERS.length; i += 1) {
    const tier = VOLUME_DISCOUNT_TIERS[i];
    if (itemTotal >= tier.min && itemTotal <= tier.max) {
      volumeRate = tier.rate;
      break;
    }
  }

  let volumeDiscount = itemTotal * volumeRate;
  let memberDiscount = memberChecked ? itemTotal * MEMBER_DISCOUNT_RATE : 0;

  if (memberChecked && volumeDiscount > 0) {
    const choice = prompt('Only one discount is allowed. Type "member" or "volume" to choose which discount to apply.');
    if (choice && choice.toLowerCase() === 'member') {
      volumeDiscount = 0;
    } else if (choice && choice.toLowerCase() === 'volume') {
      memberDiscount = 0;
      if (memberCheckbox) memberCheckbox.checked = false;
    } else {
      memberDiscount = 0;
      if (memberCheckbox) memberCheckbox.checked = false;
    }
  }

  const shipping = cart.length > 0 ? SHIPPING_RATE : 0;
  const subTotal = itemTotal - volumeDiscount - memberDiscount + shipping;
  const taxAmount = subTotal * TAX_RATE;
  const invoiceTotal = subTotal + taxAmount;

  if (cartContainer) {
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
      let rows = '';
      cart.forEach(it => {
        const lineTotal = it.unitPrice * it.qty;
        rows += `
          <tr>
            <td class="item-col">
              <img src="${it.image}" alt="${it.name}" class="thumb">
              <div class="item-info">
                <div class="item-name">${it.name}</div>
              </div>
            </td>
            <td class="qty-col">${it.qty}</td>
            <td class="amount-col">$${it.unitPrice.toFixed(2)}</td>
            <td class="amount-col">$${lineTotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${it.id}">Remove</button></td>
          </tr>
        `;
      });

      cartContainer.innerHTML = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="qty-col">Qty</th>
              <th class="amount-col">Unit Price</th>
              <th class="amount-col">Line Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }
  }

  if (summaryContainer) {
    const itemTotalDisplay = `$${Math.abs(itemTotal).toFixed(2)}`;
    const volumeDisplay = volumeDiscount > 0 ? `($${Math.abs(volumeDiscount).toFixed(2)})` : `$${Math.abs(volumeDiscount).toFixed(2)}`;
    const memberDisplay = memberDiscount > 0 ? `($${Math.abs(memberDiscount).toFixed(2)})` : `$${Math.abs(memberDiscount).toFixed(2)}`;
    const shippingDisplay = `$${Math.abs(shipping).toFixed(2)}`;
    const subTotalDisplay = `$${Math.abs(subTotal).toFixed(2)}`;
    const taxDisplay = `$${Math.abs(taxAmount).toFixed(2)}`;
    const totalDisplay = `$${Math.abs(invoiceTotal).toFixed(2)}`;

    summaryContainer.innerHTML = `
      <div class="summary-row">
        <span>Subtotal of ItemTotals</span>
        <span class="amount-col">${itemTotalDisplay}</span>
      </div>
      <div class="summary-row">
        <span>Volume Discount</span>
        <span class="amount-col">${volumeDisplay}</span>
      </div>
      <div class="summary-row">
        <span>Member Discount</span>
        <span class="amount-col">${memberDisplay}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span class="amount-col">${shippingDisplay}</span>
      </div>
      <div class="summary-row">
        <span>Subtotal (Taxable amount)</span>
        <span class="amount-col">${subTotalDisplay}</span>
      </div>
      <div class="summary-row">
        <span>Tax Rate %</span>
        <span class="amount-col">${(TAX_RATE * 100).toFixed(1)}%</span>
      </div>
      <div class="summary-row">
        <span>Tax Amount $</span>
        <span class="amount-col">${taxDisplay}</span>
      </div>
      <div class="summary-row total">
        <span>Invoice Total</span>
        <span class="amount-col">${totalDisplay}</span>
      </div>
    `;
  }

  if (cartContainer) {
    cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let nextCart;
        try { nextCart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { nextCart = []; }
        nextCart = nextCart.filter(it => it.id !== id);
        localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
        render();
      });
    });
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.setItem(CART_KEY, JSON.stringify([]));
      render();
    };
  }

  if (memberCheckbox) {
    memberCheckbox.onchange = () => render();
  }
}

document.addEventListener('DOMContentLoaded', () => render());
