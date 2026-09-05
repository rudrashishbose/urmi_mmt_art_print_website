const prints = {
  river: { name: 'River Visitor', image: 'assets/river-preview.jpg', code: 'MMT-ART-RIV-001', sizes: { A4: 1499 }, medium: 'Giclée art print reproduced from an original painting.', description: 'A quiet forest-river encounter: bear, salmon, gull, and the hush between them.' },
  iris: { name: 'Iris Vase', image: 'assets/iris-preview.jpg', code: 'MMT-ART-IRS-002', sizes: { A6: 249 }, medium: 'Fine art print reproduced from an ink illustration.', description: 'A botanical ink study with a ceremonial vase and loose fallen petals.' },
  pansy: { name: 'Pansy Moths', image: 'assets/pansy-preview.png', code: 'MMT-ART-PMY-003', sizes: { A6: 249, A5: 749 }, medium: 'Fine art print reproduced from a watercolour and coloured-pencil painting.', description: 'Pansies, leaves, a caterpillar and a blue moth in a bright garden moment.' },
  'lazy-sunday': { name: 'Lazy Sunday', image: 'assets/lazy-sunday-preview.jpg', code: 'MMT-ART-LSY-004', sizes: { A5: 749, A4: 1499 }, medium: 'Digital illustration reproduced as a fine art print.', description: 'A slow afternoon in the grass, with a fox, a napping cat, and soft wildflowers.' },
  'boat-trees': { name: 'Boat & Trees', image: 'assets/boat-and-trees-preview.jpg', code: 'MMT-ART-BTR-005', sizes: { A5: 749, A4: 1499 }, medium: 'Digital illustration reproduced as a fine art print.', description: 'A small boat drifts through a bright, patterned river landscape.' },
  'tiger-swamp': { name: 'Tiger in the Swamp', image: 'assets/tiger-swamp-preview.jpg', code: 'MMT-ART-TSW-006', sizes: { A5: 749, A4: 1499 }, medium: 'Digital illustration reproduced as a fine art print.', description: 'A tiger moves quietly through a luminous forest pool.' },
  'day-country': { name: 'Day Country', image: 'assets/day-country-preview.jpg', code: 'MMT-ART-DCT-007', sizes: { A5: 749, A4: 1499 }, medium: 'Digital illustration reproduced as a fine art print.', description: 'A bright country landscape in a palette of blue, river water, and afternoon sun.' },
  'night-country': { name: 'Night Country', image: 'assets/night-country-preview.jpg', code: 'MMT-ART-NCT-008', sizes: { A5: 749, A4: 1499 }, medium: 'Digital illustration reproduced as a fine art print.', description: 'The same hillside settles into a deep violet night beneath a moonlit sky.' }
};
const art = prints[new URLSearchParams(location.search).get('art')] || prints.river;
const dimensions = { A6: [105, 148], A5: [148, 210], A4: [210, 297], A3: [297, 420] };
let unit = localStorage.getItem('mmt-unit') || 'mm';
const image = document.getElementById('artImage');
const frame = document.getElementById('previewFrame');
const lens = document.getElementById('zoomLens');
const name = document.getElementById('artName');
const price = document.getElementById('artPrice');
const sizeSelect = document.getElementById('sizeSelect');
const unitSelect = document.getElementById('unitSelect');

image.src = art.image;
image.alt = `${art.name} web-resolution product preview`;
name.textContent = art.name;
document.getElementById('artDescription').textContent = art.description;
document.getElementById('medium').textContent = art.medium;
sizeSelect.innerHTML = Object.keys(art.sizes).map(size => `<option value="${size}">${size}</option>`).join('');
unitSelect.value = unit;

function measure(value) {
  if (unit === 'mm') return `${value.toFixed(0)} mm`;
  if (unit === 'cm') return `${(value / 10).toFixed(1)} cm`;
  if (unit === 'in') return `${(value / 25.4).toFixed(2)} in`;
  return `${(value / 304.8).toFixed(2)} ft`;
}
function renderDetails() {
  const size = sizeSelect.value;
  const values = dimensions[size];
  price.textContent = `₹${art.sizes[size].toLocaleString('en-IN')}`;
  document.getElementById('dimensions').textContent = `${measure(values[0])} × ${measure(values[1])}`;
}
if (Object.keys(art.sizes).length === 1) {
  const fixedSize = sizeSelect.value;
  sizeSelect.closest('.detail-form').querySelector('label[for="sizeSelect"]').style.display = 'none';
  sizeSelect.style.display = 'none';
  const row = document.createElement('div');
  row.innerHTML = `<dt>paper size</dt><dd>${fixedSize}</dd>`;
  document.querySelector('.art-specs').prepend(row);
}
frame.addEventListener('mousemove', event => {
  const rect = frame.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  lens.style.display = 'block';
  lens.style.left = `${x * 100}%`;
  lens.style.top = `${y * 100}%`;
  lens.style.backgroundImage = `url(${art.image})`;
  lens.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
});
frame.addEventListener('mouseleave', () => lens.style.display = 'none');
sizeSelect.onchange = renderDetails;
unitSelect.onchange = () => { unit = unitSelect.value; localStorage.setItem('mmt-unit', unit); renderDetails(); };
document.getElementById('artAdd').onclick = () => {
  const cart = JSON.parse(localStorage.getItem('mmt-cart') || '{}');
  const size = sizeSelect.value;
  const id = `${art.code}-${size}`;
  cart[id] = { name: `${art.name} · ${size}`, price: art.sizes[size] / 83.1, qty: (cart[id]?.qty || 0) + 1 };
  localStorage.setItem('mmt-cart', JSON.stringify(cart));
  const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('bagCount')?.replaceChildren(document.createTextNode(String(count)));
  document.getElementById('artAdd').textContent = 'added to cart ✓';
};
const wishlistButton = document.createElement('button');
wishlistButton.className = 'wishlist-button';
wishlistButton.type = 'button';
wishlistButton.textContent = '♡ wishlist';
document.getElementById('artAdd').after(wishlistButton);
wishlistButton.onclick = () => {
  if (!localStorage.getItem('mmt-user')) { location.href = `login.html?next=${encodeURIComponent(location.href)}`; return; }
  const list = JSON.parse(localStorage.getItem('mmt-wishlist') || '[]');
  const updated = list.includes(art.code) ? list.filter(item => item !== art.code) : [...list, art.code];
  localStorage.setItem('mmt-wishlist', JSON.stringify(updated));
  wishlistButton.textContent = updated.includes(art.code) ? '♥ saved' : '♡ wishlist';
};
const reviewStore = JSON.parse(localStorage.getItem('mmt-verified-reviews') || '{}');
const reviews = Array.isArray(reviewStore[art.code]) ? reviewStore[art.code] : [];
if (reviews.length) {
  const average = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  const section = document.createElement('section');
  section.className = 'customer-reviews';
  section.innerHTML = `<p class="eyebrow">verified customer reviews</p><h2>${average.toFixed(1)} <span aria-label="${average.toFixed(1)} out of 5 stars">${'★'.repeat(Math.round(average))}${'☆'.repeat(5 - Math.round(average))}</span></h2><p>${reviews.length} verified purchase${reviews.length === 1 ? '' : 's'}</p>${reviews.map(review => `<article class="review-card"><b>${review.name || 'Verified customer'}</b><span>${'★'.repeat(Number(review.rating || 0))}</span><p>${review.comment || ''}</p>${Array.isArray(review.images) && review.images.length ? `<div class="review-images">${review.images.map(src => `<img src="${src}" alt="Customer photo of ${art.name}" loading="lazy" />`).join('')}</div>` : ''}</article>`).join('')}`;
  document.querySelector('.art-detail > .art-detail-grid').insertAdjacentElement('afterend', section);
  const style = document.createElement('style');
  style.textContent = `.customer-reviews{max-width:760px;margin:80px auto 0;border-top:var(--line);padding-top:32px}.customer-reviews h2{font:34px "DM Serif Display";margin:0}.customer-reviews h2 span,.review-card>span{color:var(--yellow);font:18px "DM Mono"}.review-card{border-top:1px solid var(--ink);padding:18px 0;margin-top:22px}.review-card b{font-size:11px}.review-card p{margin:9px 0}.review-images{display:flex;gap:10px;flex-wrap:wrap}.review-images img{width:92px;height:92px;object-fit:cover;border:1px solid var(--ink)}`;
  document.head.append(style);
}
const navigationScript = document.createElement('script');
navigationScript.src = 'navigation.js';
document.head.append(navigationScript);
renderDetails();
