const currencyOptions = {
  IN: { code: 'INR', locale: 'en-IN', rate: 83.1, flag: '🇮🇳' },
  US: { code: 'USD', locale: 'en-US', rate: 1, flag: '🇺🇸' },
  GB: { code: 'GBP', locale: 'en-GB', rate: 0.79, flag: '🇬🇧' },
  EU: { code: 'EUR', locale: 'de-DE', rate: 0.92, flag: '🇪🇺' }
};
const navigationScript = document.createElement('script'); navigationScript.src = 'navigation.js'; document.head.append(navigationScript);
let country = localStorage.getItem('mmt-country') || 'IN';
let cart = JSON.parse(localStorage.getItem('mmt-cart') || '{}');
const money = usd => new Intl.NumberFormat(currencyOptions[country].locale, { style: 'currency', currency: currencyOptions[country].code, maximumFractionDigits: 0 }).format(usd * currencyOptions[country].rate);
const saveCart = () => localStorage.setItem('mmt-cart', JSON.stringify(cart));
const itemCount = () => Object.values(cart).reduce((total, item) => total + item.qty, 0);
function productData(product) {
  const selectedSize = product.dataset.activeSize;
  return {
    id: product.dataset.id,
    name: `${product.querySelector('h3').textContent}${selectedSize ? ` · ${selectedSize}` : ''}`,
    price: Number(product.dataset.activePrice || product.dataset.price)
  };
}
function updateCurrency() {
  document.querySelectorAll('[data-usd]').forEach(node => node.textContent = money(Number(node.dataset.usd)));
  const button = document.getElementById('localeButton');
  if (button) button.innerHTML = `${currencyOptions[country].flag} <span>${currencyOptions[country].code}</span>⌄`;
}
function setQuantity(product, quantity) {
  const item = productData(product);
  if (quantity <= 0) delete cart[item.id];
  else cart[item.id] = { name: item.name, price: item.price, qty: quantity };
  saveCart(); renderCart();
}
function bindProductControls(product, holder) {
  const id = product.dataset.id;
  const add = holder.querySelector('.add');
  const sizePick = holder.querySelector('.size-pick');
  if (sizePick && add) {
    sizePick.onchange = event => {
      event.stopPropagation();
      const option = sizePick.options[sizePick.selectedIndex];
      product.dataset.activeSize = option.value;
      product.dataset.activePrice = option.dataset.price || product.dataset.price;
      add.disabled = !option.value;
    };
    add.onclick = event => {
      event.stopPropagation();
      if (sizePick.value) setQuantity(product, 1);
    };
  } else if (add) add.onclick = event => { event.stopPropagation(); setQuantity(product, 1); };
  holder.querySelectorAll('[data-step]').forEach(button => button.onclick = event => { event.stopPropagation(); setQuantity(product, (cart[id]?.qty || 0) + Number(button.dataset.step)); });
  const remove = holder.querySelector('.remove-product');
  if (remove) remove.onclick = event => { event.stopPropagation(); setQuantity(product, 0); };
  const input = holder.querySelector('input');
  if (input) input.onchange = event => { event.stopPropagation(); setQuantity(product, Math.max(0, Number.parseInt(input.value, 10) || 0)); };
  const wish = holder.querySelector('.wishlist-button');
  if (wish) wish.onclick = event => {
    event.stopPropagation();
    const next = encodeURIComponent(location.pathname.split('/').pop() + location.hash);
    if (!localStorage.getItem('mmt-user')) { location.href = `login.html?next=${next}`; return; }
    const list = JSON.parse(localStorage.getItem('mmt-wishlist') || '[]');
    const id = product.dataset.id;
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    localStorage.setItem('mmt-wishlist', JSON.stringify(updated));
    wish.textContent = updated.includes(id) ? '♥ saved' : '♡ wishlist';
  };
}
function renderCart() {
  const total = itemCount();
  const badge = document.getElementById('bagCount');
  const preview = document.getElementById('cartPreviewItems');
  if (badge) badge.textContent = total;
  if (preview) preview.innerHTML = total ? Object.values(cart).map(item => `<p>${item.name} <b>×${item.qty}</b></p>`).join('') : '<p>Your cart is empty.</p>';
  document.querySelectorAll('.product[data-id]').forEach(product => {
    const id = product.dataset.id;
    let holder = product.querySelector('.product-action');
    if (!holder) { holder = document.createElement('div'); holder.className = 'product-action'; product.querySelector('.add').replaceWith(holder); }
    const reviewCodes = { river: 'MMT-ART-RIV-001', iris: 'MMT-ART-IRS-002', pansy: 'MMT-ART-PMY-003' };
    const productReviews = JSON.parse(localStorage.getItem('mmt-verified-reviews') || '{}')[reviewCodes[id]] || [];
    let rating = product.querySelector('.rating-summary');
    if (productReviews.length && !rating) { const average = productReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / productReviews.length; rating = document.createElement('p'); rating.className = 'rating-summary'; rating.textContent = `${'★'.repeat(Math.round(average))}${'☆'.repeat(5 - Math.round(average))} ${average.toFixed(1)} (${productReviews.length})`; product.querySelector('h3').insertAdjacentElement('afterend', rating); }
    const quantity = cart[id]?.qty || 0;
    const sizes = (product.dataset.sizeOptions || (id === 'pansy' ? 'A6:249,A5:749' : '')).split(',').filter(Boolean);
    const sizePicker = sizes.length
      ? `<select class="size-pick" aria-label="Select paper size for ${product.querySelector('h3').textContent}"><option value="">select size</option>${sizes.map(option => { const [size, price] = option.split(':'); return `<option value="${size}" data-price="${Number(price) / 83.1}">${size} · ₹${Number(price).toLocaleString('en-IN')}</option>`; }).join('')}</select><button class="add" disabled>add to cart</button>`
      : '<button class="add">add to cart</button>';
    const saved = JSON.parse(localStorage.getItem('mmt-wishlist') || '[]').includes(id);
    const wish = `<button class="wishlist-button" type="button">${saved ? '♥ saved' : '♡ wishlist'}</button>`;
    holder.innerHTML = quantity
      ? `<div class="quantity-control"><button data-step="-1" aria-label="Subtract one">−</button><input aria-label="${cart[id].name} quantity" inputmode="numeric" value="${quantity}"><button data-step="1" aria-label="Add one">+</button></div><button class="remove-product">remove</button><span class="added-label">Added in cart</span>${wish}`
      : `${sizePicker}${wish}`;
    bindProductControls(product, holder);
  });
}
function setCountry(nextCountry) {
  country = currencyOptions[nextCountry] ? nextCountry : 'IN';
  localStorage.setItem('mmt-country', country);
  updateCurrency();
  document.getElementById('localeMenu')?.classList.remove('open');
}
document.querySelectorAll('.product[data-id]').forEach(product => {
  product.addEventListener('click', event => {
    if (event.target.closest('.product-action, .product-image-link')) return;
    if (product.dataset.productUrl) window.location.href = product.dataset.productUrl;
  });
  product.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && product.dataset.productUrl) { event.preventDefault(); window.location.href = product.dataset.productUrl; } });
});
document.getElementById('localeButton')?.addEventListener('click', () => {
  const menu = document.getElementById('localeMenu'); menu.classList.toggle('open'); document.getElementById('localeButton').setAttribute('aria-expanded', menu.classList.contains('open'));
});
document.querySelectorAll('[data-country]').forEach(button => button.addEventListener('click', () => setCountry(button.dataset.country)));
document.getElementById('locateButton')?.addEventListener('click', () => {
  const status = document.getElementById('locationStatus');
  status.textContent = 'Requesting permission…';
  navigator.geolocation?.getCurrentPosition(async position => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`, { headers: { Accept: 'application/json' } });
      const location = await response.json(); const code = (location.address?.country_code || '').toUpperCase();
      setCountry(code === 'IN' ? 'IN' : code === 'US' ? 'US' : code === 'GB' ? 'GB' : 'EU');
      status.textContent = `Location found — prices now in ${currencyOptions[country].code}.`;
    } catch { status.textContent = 'Location found — select your currency above.'; }
  }, () => { status.textContent = 'Location permission was not granted.'; });
});
document.getElementById('newsletterForm')?.addEventListener('submit', event => { event.preventDefault(); event.currentTarget.querySelector('.form-message').textContent = 'You’re on the list — see you next moon.'; event.currentTarget.reset(); });
document.querySelector('.menu-toggle')?.addEventListener('click', event => { const nav = document.getElementById('site-nav'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); event.currentTarget.querySelector('b').textContent = open ? '−' : '+'; });
document.getElementById('techToggle')?.addEventListener('click', event => { const note = document.getElementById('techNote'); const open = note.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); event.currentTarget.querySelector('span').textContent = open ? '−' : '+'; });
document.querySelectorAll('.product-image-link').forEach(link => {
  const image = link.querySelector('img');
  if (!image) return;
  image.style.transition = 'transform .2s ease';
  link.addEventListener('mouseenter', () => { image.style.transform = 'scale(1.04)'; });
  link.addEventListener('mouseleave', () => { image.style.transform = ''; });
});
updateCurrency(); renderCart();
document.addEventListener('mmt:catalog-updated', renderCart);
