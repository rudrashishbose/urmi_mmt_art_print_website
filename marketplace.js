(() => {
  const STORAGE_KEYS = {
    listings: 'mmt-market-listings',
    cart: 'mmt-market-cart',
    otp: 'mmt-market-otp',
    customer: 'mmt-market-customer',
    addresses: 'mmt-market-addresses',
    orders: 'mmt-market-orders'
  };
  const ADMIN_KEY = 'mmt-admin-auth';
  const STUDIO_ORDER_EMAIL = 'rudrashishbose29@gmail.com';

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const rupee = amount => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
  const byId = id => document.getElementById(id);
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const starterListings = [
    {
      id: 'sample-river',
      title: 'River Visitor',
      description: 'A quiet forest-river print with bear, salmon, and a little hush between them.',
      price: 1499,
      dimensions: 'A4 · 210 x 297 mm',
      image: 'assets/river-preview.jpg',
      status: 'published',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'sample-pansy',
      title: 'Pansy Moths',
      description: 'Small garden study with pansies, leaves, and a blue moth.',
      price: 749,
      dimensions: 'A5 · 148 x 210 mm',
      image: 'assets/pansy-preview.png',
      status: 'published',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  function getListings() {
    const listings = read(STORAGE_KEYS.listings, null);
    if (Array.isArray(listings)) return listings;
    write(STORAGE_KEYS.listings, starterListings);
    return starterListings;
  }

  function getCart() {
    return read(STORAGE_KEYS.cart, {});
  }

  function saveCart(cart) {
    write(STORAGE_KEYS.cart, cart);
  }

  function cartCount(cart = getCart()) {
    return Object.values(cart).reduce((total, line) => total + Number(line.qty || 0), 0);
  }

  function publishedListings() {
    return getListings().filter(item => item.status === 'published');
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderAdminListings() {
    const list = byId('listingList');
    if (!list) return;

    const listings = getListings();
    list.innerHTML = listings.length
      ? listings.map(item => `
        <article class="tool-row">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <span>${item.status}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <small>${rupee(item.price)} · ${item.dimensions}</small>
          </div>
          <button type="button" data-delete="${item.id}">Remove</button>
        </article>`).join('')
      : '<p class="empty-cart">No listings yet. Add the first piece above.</p>';

    list.querySelectorAll('[data-delete]').forEach(button => {
      button.onclick = () => {
        write(STORAGE_KEYS.listings, listings.filter(item => item.id !== button.dataset.delete));
        renderAdminListings();
      };
    });
  }

  function bindAdminPage() {
    const loginPanel = byId('adminLoginPanel');
    const adminTools = byId('adminTools');
    const loginForm = byId('adminLoginForm');
    const form = byId('listingForm');
    if (!form) return;

    const unlockAdmin = () => {
      localStorage.setItem(ADMIN_KEY, 'true');
      loginPanel.hidden = true;
      adminTools.hidden = false;
      document.querySelector('.admin-shell')?.classList.remove('admin-locked');
      const nav = document.querySelector('#site-nav');
      if (nav && !nav.querySelector('a[href="studio-admin.html"]')) {
        nav.insertAdjacentHTML('beforeend', '<a class="active" aria-current="page" href="studio-admin.html">admin</a>');
      }
      renderAdminListings();
    };

    if (localStorage.getItem(ADMIN_KEY) === 'true') {
      unlockAdmin();
    } else {
      loginPanel.hidden = false;
      adminTools.hidden = true;
    }

    loginForm?.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(loginForm);
      const username = data.get('username').trim();
      const password = data.get('password').trim();
      if (username !== 'admin' || password !== 'admin') {
        byId('adminLoginMessage').textContent = 'Use username admin and password admin.';
        return;
      }
      byId('adminLoginMessage').textContent = '';
      unlockAdmin();
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      const file = data.get('image');
      const image = file && file.size ? await fileToDataUrl(file) : 'assets/iris-preview.jpg';
      const listing = {
        id: uid(),
        title: data.get('title').trim(),
        description: data.get('description').trim(),
        price: Number(data.get('price')),
        dimensions: data.get('dimensions').trim(),
        image,
        status: data.get('status'),
        createdAt: new Date().toISOString()
      };

      write(STORAGE_KEYS.listings, [listing, ...getListings()]);
      form.reset();
      byId('listingMessage').textContent = 'Listing saved to this browser preview.';
      renderAdminListings();
    });
  }

  function renderShopListings() {
    const grid = byId('shopListings');
    if (!grid) return;

    const items = publishedListings();
    const catalogOnly = document.body.dataset.catalogOnly === 'true';
    grid.innerHTML = items.length
      ? items.map(item => `
        <article class="shop-listing">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <p class="product-type">${item.dimensions}</p>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <strong>${rupee(item.price)}</strong>
            ${catalogOnly ? '<a class="catalog-order-link" href="shop.html">Order in shop</a>' : `<button type="button" data-add="${item.id}">Add to cart</button>`}
          </div>
        </article>`).join('')
      : '<p class="empty-cart">No published pieces yet.</p>';

    grid.querySelectorAll('[data-add]').forEach(button => {
      button.onclick = () => {
        const listing = items.find(item => item.id === button.dataset.add);
        const cart = getCart();
        cart[listing.id] = {
          id: listing.id,
          title: listing.title,
          price: listing.price,
          image: listing.image,
          qty: (cart[listing.id]?.qty || 0) + 1
        };
        saveCart(cart);
        renderShopCart();
      };
    });
  }

  function renderShopCart() {
    const cartNode = byId('shopCart');
    if (!cartNode) return;

    const cart = getCart();
    const items = Object.values(cart);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartNode.innerHTML = items.length
      ? `${items.map(item => `
        <div class="mini-cart-row">
          <img src="${item.image}" alt="" />
          <span>${item.title}<small>x${item.qty}</small></span>
          <b>${rupee(item.price * item.qty)}</b>
          <button type="button" data-remove="${item.id}">Remove</button>
        </div>`).join('')}
        <div class="market-total"><span>Total</span><strong>${rupee(subtotal)}</strong></div>`
      : '<p class="empty-cart">Your cart is empty.</p>';

    byId('cartBadge').textContent = cartCount(cart);
    cartNode.querySelectorAll('[data-remove]').forEach(button => {
      button.onclick = () => {
        delete cart[button.dataset.remove];
        saveCart(cart);
        renderShopCart();
      };
    });
  }

  function currentCustomer() {
    return read(STORAGE_KEYS.customer, null);
  }

  function renderCustomerState() {
    const customer = currentCustomer();
    const node = byId('customerState');
    if (!node) return;

    node.innerHTML = customer
      ? `<b>${customer.email}</b><button type="button" id="logoutButton">Log out</button>`
      : '<span>Not signed in</span><a class="text-link" href="login.html">log in -></a>';
    byId('logoutButton')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.customer);
      const loginLink = document.querySelector('.login-link');
      if (loginLink) {
        loginLink.textContent = 'log in';
        loginLink.href = 'login.html';
        loginLink.classList.remove('active');
      }
      renderCustomerState();
      renderAddresses();
      renderOrderHistory();
    });
  }

  function bindOtpLogin() {
    const form = byId('otpRequestForm');
    const verifyForm = byId('otpVerifyForm');
    if (!form || !verifyForm) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      const email = new FormData(form).get('email').trim().toLowerCase();
      const code = String(Math.floor(100000 + Math.random() * 900000));
      write(STORAGE_KEYS.otp, { email, code, expiresAt: Date.now() + 10 * 60 * 1000 });
      byId('otpMessage').textContent = `Preview OTP: ${code}. A production site would email this code from the server.`;
    });

    verifyForm.addEventListener('submit', event => {
      event.preventDefault();
      const pending = read(STORAGE_KEYS.otp, null);
      const code = new FormData(verifyForm).get('otp').trim();
      if (!pending || pending.expiresAt < Date.now() || pending.code !== code) {
        byId('otpMessage').textContent = 'The code is incorrect or expired.';
        return;
      }

      write(STORAGE_KEYS.customer, { email: pending.email, verifiedAt: new Date().toISOString() });
      localStorage.removeItem(STORAGE_KEYS.otp);
      byId('otpMessage').textContent = 'Signed in for this browser preview.';
      renderCustomerState();
      renderAddresses();
      renderOrderHistory();
      const loginLink = document.querySelector('.login-link');
      if (loginLink) {
        loginLink.textContent = pending.email;
        loginLink.href = 'account.html';
      }
    });
  }

  function renderAddresses() {
    const list = byId('addressList');
    if (!list) return;

    const customer = currentCustomer();
    if (!customer) {
      list.innerHTML = '<p class="empty-cart">Sign in with email OTP to save addresses in this browser preview.</p>';
      return;
    }

    const addresses = read(STORAGE_KEYS.addresses, []);
    list.innerHTML = addresses.length
      ? addresses.map(address => `
        <label class="address-card">
          <input type="radio" name="selectedAddress" value="${address.id}" ${address.default ? 'checked' : ''} />
          <span><b>${address.name}</b>${address.line1}, ${address.city}, ${address.region} ${address.postal}</span>
        </label>`).join('')
      : '<p class="empty-cart">No saved addresses yet.</p>';
  }

  function renderOrderHistory() {
    const node = byId('orderHistory');
    if (!node) return;

    const customer = currentCustomer();
    if (!customer) {
      node.innerHTML = '<p class="empty-cart">Log in to see order drafts from this browser.</p>';
      return;
    }

    const orders = read(STORAGE_KEYS.orders, []).filter(order => order.email === customer.email);
    node.innerHTML = orders.length
      ? orders.map(order => `
        <article class="order-card">
          <b>${rupee(order.total)}</b>
          <span>${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <small>${order.items.map(item => `${item.title} x${item.qty}`).join(', ')}</small>
        </article>`).join('')
      : '<p class="empty-cart">No order drafts yet.</p>';
  }

  function bindAddressForm() {
    const form = byId('addressForm');
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!currentCustomer()) {
        byId('addressMessage').textContent = 'Sign in before saving an address.';
        return;
      }

      const data = new FormData(form);
      const addresses = read(STORAGE_KEYS.addresses, []);
      addresses.push({
        id: uid(),
        name: data.get('name').trim(),
        line1: data.get('line1').trim(),
        city: data.get('city').trim(),
        region: data.get('region').trim(),
        postal: data.get('postal').trim(),
        default: addresses.length === 0
      });
      write(STORAGE_KEYS.addresses, addresses);
      form.reset();
      byId('addressMessage').textContent = 'Address saved.';
      renderAddresses();
    });
  }

  function bindCheckout() {
    const button = byId('placeOrder');
    if (!button) return;

    button.onclick = () => {
      const customer = currentCustomer();
      const cart = getCart();
      const items = Object.values(cart);
      const selectedAddress = document.querySelector('[name="selectedAddress"]:checked')?.value;
      const addresses = read(STORAGE_KEYS.addresses, []);
      const address = addresses.find(item => item.id === selectedAddress);

      if (!customer) {
        byId('orderMessage').textContent = 'Sign in before emailing the order.';
        return;
      }
      if (!items.length) {
        byId('orderMessage').textContent = 'Add at least one item before emailing the order.';
        return;
      }
      if (!address) {
        byId('orderMessage').textContent = 'Choose or add a shipping address.';
        return;
      }

      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const orders = read(STORAGE_KEYS.orders, []);
      const orderId = uid();
      orders.unshift({
        id: orderId,
        email: customer.email,
        addressId: address.id,
        items,
        total,
        status: 'email draft created',
        createdAt: new Date().toISOString()
      });
      write(STORAGE_KEYS.orders, orders);
      saveCart({});
      const itemLines = items.map(item => `- ${item.title} x${item.qty}: ${rupee(item.price * item.qty)}`).join('\n');
      const addressLines = [
        address.name,
        address.line1,
        `${address.city}, ${address.region} ${address.postal}`
      ].join('\n');
      const subject = encodeURIComponent(`MissMoodyTiger order request - ${orderId}`);
      const body = encodeURIComponent([
        'New order request',
        '',
        `Customer email: ${customer.email}`,
        '',
        'Items:',
        itemLines,
        '',
        `Total: ${rupee(total)}`,
        '',
        'Shipping address:',
        addressLines,
        '',
        'This order was created from the static shop preview.'
      ].join('\n'));

      byId('orderMessage').textContent = `Email draft opened for ${STUDIO_ORDER_EMAIL}.`;
      renderShopCart();
      location.href = `mailto:${STUDIO_ORDER_EMAIL}?subject=${subject}&body=${body}`;
    };
  }

  function bindShopPage() {
    if (!byId('shopListings')) return;
    renderShopListings();
    renderShopCart();
    renderCustomerState();
    renderAddresses();
    bindOtpLogin();
    bindAddressForm();
    bindCheckout();
  }

  function bindLoginPage() {
    if (!byId('otpRequestForm') || byId('shopListings')) return;
    renderCustomerState();
    bindOtpLogin();
  }

  function bindAccountPage() {
    if (!document.querySelector('.account-shell')) return;
    renderCustomerState();
    renderAddresses();
    renderOrderHistory();
    bindAddressForm();
  }

  bindAdminPage();
  bindShopPage();
  bindLoginPage();
  bindAccountPage();
})();
