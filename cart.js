const currencyOptions = {
  IN: { code: 'INR', locale: 'en-IN', rate: 83.1 },
  US: { code: 'USD', locale: 'en-US', rate: 1 },
  GB: { code: 'GBP', locale: 'en-GB', rate: 0.79 },
  EU: { code: 'EUR', locale: 'de-DE', rate: 0.92 }
};

const previews = {
  river: 'assets/river-preview.jpg',
  iris: 'assets/iris-preview.jpg',
  pansy: 'assets/pansy-preview.png',
  'lazy-sunday': 'assets/lazy-sunday-preview.jpg',
  'boat-trees': 'assets/boat-and-trees-preview.jpg',
  'tiger-swamp': 'assets/tiger-swamp-preview.jpg',
  'day-country': 'assets/day-country-preview.jpg',
  'night-country': 'assets/night-country-preview.jpg'
};

const country = localStorage.getItem('mmt-country') || 'IN';
let cart = JSON.parse(localStorage.getItem('mmt-cart') || '{}');
const money = usd => new Intl.NumberFormat(currencyOptions[country].locale, {
  style: 'currency', currency: currencyOptions[country].code, maximumFractionDigits: 0
}).format(usd * currencyOptions[country].rate);

function render() {
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');
  const items = Object.entries(cart);
  if (!items.length) {
    list.innerHTML = '<p class="empty-cart">Your cart is empty — <a href="index.html#shop">find a treasure</a>.</p>';
    summary.innerHTML = '';
    return;
  }

  list.innerHTML = items.map(([id, item]) => `
    <article class="cart-row">
      <div class="cart-item-info">
        <img class="cart-product-image" src="${previews[id] || previews[item.id] || previews.river}" alt="${item.name} preview" />
        <div>
          <h2>${item.name}</h2>
          <p>${money(item.price)} each</p>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button data-id="${id}" data-step="-1" aria-label="Reduce ${item.name} quantity">−</button>
              <input data-id="${id}" aria-label="${item.name} quantity" value="${item.qty}" inputmode="numeric">
              <button data-id="${id}" data-step="1" aria-label="Increase ${item.name} quantity">+</button>
            </div>
            <button class="remove-product" data-remove="${id}">remove</button>
          </div>
        </div>
      </div>
      <p class="cart-item-total">${money(item.price * item.qty)}</p>
    </article>`).join('');

  const total = items.reduce((sum, [, item]) => sum + item.price * item.qty, 0);
  summary.innerHTML = `<div><span>Total</span><b>${money(total)}</b></div><button class="checkout-button">checkout securely →</button>`;
  document.querySelectorAll('[data-step]').forEach(button => button.onclick = () => change(button.dataset.id, (cart[button.dataset.id]?.qty || 0) + Number(button.dataset.step)));
  document.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => change(button.dataset.remove, 0));
  document.querySelectorAll('.quantity-control input').forEach(input => input.onchange = () => change(input.dataset.id, Math.max(0, parseInt(input.value) || 0)));
}

function change(id, qty) {
  if (qty <= 0) delete cart[id];
  else cart[id].qty = qty;
  localStorage.setItem('mmt-cart', JSON.stringify(cart));
  render();
}

render();
