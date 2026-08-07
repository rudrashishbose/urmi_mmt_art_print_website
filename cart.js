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
const shippingThresholdUsd = 650 / 83.1;
const shippingChargeUsd = 80 / 83.1;
const money = usd => new Intl.NumberFormat(currencyOptions[country].locale, {
  style: 'currency', currency: currencyOptions[country].code, maximumFractionDigits: 0
}).format(usd * currencyOptions[country].rate);

function render() {
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');
  const items = Object.entries(cart);
  if (!document.querySelector('.cart-navigation')) {
    list.insertAdjacentHTML('beforebegin', '<nav class="cart-navigation" aria-label="Cart navigation"><button type="button" id="historyBack">← back</button><button type="button" id="historyForward">forward →</button><a href="products.html">continue shopping</a></nav>');
    document.getElementById('historyBack').onclick = () => history.length > 1 ? history.back() : location.assign('products.html');
    document.getElementById('historyForward').onclick = () => history.forward();
  }
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

  const subtotal = items.reduce((sum, [, item]) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= shippingThresholdUsd ? 0 : shippingChargeUsd;
  const total = subtotal + shipping;
  summary.innerHTML = `<div><span>Subtotal</span><b>${money(subtotal)}</b></div><div><span>Shipping</span><b>${shipping ? money(shipping) : 'Free'}</b></div><p class="shipping-note">Free shipping above ${money(shippingThresholdUsd)}; otherwise ${money(shippingChargeUsd)}.</p><div><span>Total</span><b>${money(total)}</b></div><button class="checkout-button">checkout securely →</button>`;
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
