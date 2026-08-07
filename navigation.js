(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const page = location.pathname.split('/').pop() || 'index.html';
  const hash = location.hash;
  const active = page === 'products.html' || page === 'art-print.html' || page === 'gallery.html' || page === 'midnight-familiar.html'
    ? 'shop'
    : page === 'blog.html' ? 'blog'
    : page === 'portfolio.html' ? 'work'
    : hash === '#shop' ? 'shop'
    : hash === '#work' ? 'work'
    : hash === '#about' ? 'about'
    : hash === '#original-art' ? 'original'
    : 'home';
  const cart = JSON.parse(localStorage.getItem('mmt-cart') || '{}');
  const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const country = localStorage.getItem('mmt-country') || 'IN';
  const flags = { IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', EU: '🇪🇺' };
  const label = { IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR' };
  const user = JSON.parse(localStorage.getItem('mmt-user') || 'null');
  const item = (id, href, text) => `<a ${active === id ? 'class="active" aria-current="page"' : ''} href="${href}">${text}</a>`;

  const style = document.createElement('style');
  style.textContent = `.site-header{gap:28px}.site-header nav{gap:24px}.site-header nav a.active{color:var(--red);border-bottom:2px solid var(--red);padding-bottom:3px}.nav-dropdown{position:relative}.nav-dropdown>button{border:0;background:transparent;color:var(--ink);font:12px "DM Mono";letter-spacing:.06em;text-transform:uppercase;cursor:pointer;padding:0}.nav-dropdown>button.active{color:var(--red);border-bottom:2px solid var(--red);padding-bottom:3px}.shop-menu{display:none;position:absolute;top:23px;left:-12px;width:140px;background:var(--paper);border:var(--line);padding:10px;z-index:35;box-shadow:4px 4px 0 var(--ink)}.nav-dropdown:hover .shop-menu,.nav-dropdown:focus-within .shop-menu,.nav-dropdown.open .shop-menu{display:grid;gap:7px}.shop-menu a{font-size:10px!important}.header-tools{margin-left:auto;display:flex;align-items:center;gap:22px}.login-link,.wishlist-button{border:0;background:transparent;border-bottom:1px solid var(--ink);padding:0 0 2px;color:var(--ink);font:10px "DM Mono";text-decoration:none;text-transform:uppercase;cursor:pointer}.wishlist-button{color:var(--red)}.locale-picker{position:relative}.locale-picker>button{border:0;background:transparent;color:var(--ink);font:11px "DM Mono";cursor:pointer}.locale-menu{display:none;position:absolute;right:0;top:26px;width:92px;background:var(--paper);border:var(--line);padding:7px;z-index:30}.locale-menu.open{display:block}.locale-menu button{width:100%;border:0;background:transparent;text-align:left;padding:6px 2px;color:var(--ink);font:10px "DM Mono";cursor:pointer}.locale-menu button:hover{color:var(--red)}.catalog-image{max-width:260px;margin-inline:auto}.catalog-image img{max-height:300px;object-fit:contain}.catalog-disclaimer{max-width:650px;border-left:3px solid var(--red);padding:13px 16px;background:#f8efe4;font-size:10px;margin:0 0 45px}.catalog-disclaimer strong{text-transform:uppercase;letter-spacing:.06em}.shop-section .product-grid{gap:24px;align-items:start}.shop-section .product.offset{margin-top:0}.shop-section .product-art{margin-bottom:10px}.shop-section .product h3{font-size:22px}.studio-notes-section{padding:75px 10vw;background:#efdbcf;border-block:var(--line)}.studio-notes-section h2{font:clamp(38px,5vw,64px) "DM Serif Display";margin:10px 0 20px}.studio-notes-section p{max-width:720px}.studio-notes-section a{font-family:Fraunces,serif;font-size:17px}.social-links{display:flex;gap:14px;align-items:center}.social-links a{font-size:10px;text-transform:uppercase}@media(max-width:760px){.site-header{height:auto;min-height:82px;flex-wrap:wrap;padding-block:16px}.site-header nav{order:3;width:100%;margin:0;gap:15px;flex-wrap:wrap}.header-tools{margin-left:auto;gap:12px}}`;
  document.head.append(style);

  header.innerHTML = `<a class="wordmark" href="index.html">Miss<br /><i>Moody</i>Tiger<span>™</span></a><nav id="site-nav">${item('home', 'index.html', 'home')}<div class="nav-dropdown"><button type="button" class="${active === 'shop' ? 'active' : ''}">shop⌄</button><div class="shop-menu"><a href="products.html">shop all</a><a href="products.html">art prints</a><a href="index.html#original-art">original art</a></div></div>${item('blog', 'blog.html', 'blog')}${item('work', 'portfolio.html', 'work')}${item('about', 'index.html#about', 'about me')}</nav><div class="header-tools"><div class="locale-picker"><button id="localeButton" type="button" aria-label="Choose currency">${flags[country]} <span>${label[country]}</span>⌄</button><div class="locale-menu" id="localeMenu"><button data-country="IN">🇮🇳 INR</button><button data-country="US">🇺🇸 USD</button><button data-country="GB">🇬🇧 GBP</button><button data-country="EU">🇪🇺 EUR</button></div></div><a class="login-link" href="login.html">${user?.name || 'log in'}</a><a class="bag" href="cart.html">cart <span id="bagCount">${count}</span></a></div>`;

  const button = document.getElementById('localeButton');
  const menu = document.getElementById('localeMenu');
  header.querySelector('.nav-dropdown>button')?.addEventListener('click', event => { event.currentTarget.parentElement.classList.toggle('open'); });
  button?.addEventListener('click', () => menu.classList.toggle('open'));
  menu?.querySelectorAll('[data-country]').forEach(option => option.addEventListener('click', () => {
    localStorage.setItem('mmt-country', option.dataset.country);
    location.reload();
  }));
  if (page === 'products.html') {
    const catalogue = document.querySelector('.catalog');
    const heading = document.querySelector('.catalog-heading');
    if (heading && !document.querySelector('.catalog-disclaimer')) heading.insertAdjacentHTML('afterend', '<aside class="catalog-disclaimer"><strong>Colour & display note</strong><br />Colours may vary slightly from the on-screen preview</aside>');
    if (heading?.querySelector('h1')) heading.querySelector('h1').innerHTML = 'Art<br /><em>Prints</em>';
    catalogue?.querySelectorAll('.catalog-product img').forEach(image => {
      if (image.alt.includes('River')) image.src = 'assets/river-preview.jpg';
      if (image.alt.includes('Iris')) image.src = 'assets/iris-preview.jpg';
      if (image.alt.includes('Pansy')) image.src = 'assets/pansy-preview.png';
    });
    const grid = document.querySelector('.catalog-grid');
    const additions = [
      { id: 'lazy-sunday', name: 'Lazy Sunday', image: 'assets/lazy-sunday-preview.jpg', sizes: 'A5:749,A4:1499' },
      { id: 'boat-trees', name: 'Boat & Trees', image: 'assets/boat-and-trees-preview.jpg', sizes: 'A5:749,A4:1499' },
      { id: 'tiger-swamp', name: 'Tiger in the Swamp', image: 'assets/tiger-swamp-preview.jpg', sizes: 'A5:749,A4:1499' },
      { id: 'day-country', name: 'Day Country', image: 'assets/day-country-preview.jpg', sizes: 'A5:749,A4:1499' },
      { id: 'night-country', name: 'Night Country', image: 'assets/night-country-preview.jpg', sizes: 'A5:749,A4:1499' }
    ];
    if (grid && !grid.querySelector('[data-id="lazy-sunday"]')) {
      grid.insertAdjacentHTML('beforeend', additions.map(product => { const options = product.sizes.split(',').map(item => item.split(':')); const price = options[0][1]; const range = options.length > 1 ? `₹${Number(options[0][1]).toLocaleString('en-IN')} – ₹${Number(options.at(-1)[1]).toLocaleString('en-IN')}` : `₹${Number(price).toLocaleString('en-IN')}`; const sizes = options.map(item => item[0]).join(' · '); return `<article class="catalog-product product" data-id="${product.id}" data-price="${Number(price) / 83.1}" data-size-options="${product.sizes}"><a class="catalog-image product-image-link" href="art-print.html?art=${product.id}" target="_blank" rel="noopener" aria-label="${product.name} art print"><img src="${product.image}" alt="${product.name} digital art print" /></a><div class="catalog-meta"><p class="product-type">art print · digital medium</p><h3>${product.name}</h3><p>${range} · ${sizes}</p><div class="product-action"><button class="add">add to cart</button></div></div></article>`; }).join(''));
      setTimeout(() => document.dispatchEvent(new Event('mmt:catalog-updated')), 0);
    }
  }
  if (page === 'index.html') {
    const shopLink = document.querySelector('#shop .section-heading .text-link');
    if (shopLink) shopLink.textContent = 'shop →';
    if (!document.querySelector('.studio-notes-section')) {
      const section = '<section class="studio-notes-section" id="studio-notes"><p class="eyebrow">please read before ordering</p><h2>Terms &<br />Conditions</h2><p>Our art prints are made in small batches. Delivered colour may vary slightly from the image shown on your screen. Prints are final sale once delivered; however, if an item arrives damaged or incorrect, please contact the studio within 48 hours with an uninterrupted unboxing video that clearly shows the parcel and damage from receipt onward. If our team verifies the claim, we will send a fresh copy.</p><a href="terms.html">read the full Terms & Conditions →</a></section>';
      document.querySelector('footer')?.insertAdjacentHTML('beforebegin', section);
    }
  }
  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.social-links')) footer.insertAdjacentHTML('beforeend', '<div class="social-links" aria-label="Social channels"><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">◎ Instagram</a><a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">▶ YouTube</a></div>');
})();
