# Website information

## Purpose

MissMoodyTiger presents and sells small-run art prints. The experience includes product browsing, product details, size-specific prices, local-currency display, a client-side cart, wishlist affordances, terms, and preview email OTP login.

## Pages

| Route | Purpose |
| --- | --- |
| `index.html` | Simplified home route with a MissMoodyTiger shop banner and catalogue. |
| `products.html` | Art-print catalogue; every artwork card opens its detail page in a new tab. |
| `art-print.html?art=<id>` | Shared product-detail template, selected by product id. |
| `cart.html` | Browser-local cart with thumbnails, quantities, remove control, and terms gate. |
| `studio-admin.html` | Prototype listing manager gated by the local admin/admin credential check. |
| `shop.html` | Prototype customer shop with demo OTP login, cart, saved addresses, and an email order request. |
| `terms.html` | Public Terms & Conditions; acknowledgement only appears before checkout. |
| `login.html` | Preview email OTP login surface for customer sessions stored in this browser. |
| `portfolio.html` | Studio portfolio route. |

## Catalogue and pricing

All catalogue items are art prints. Standard size prices are: A6 ₹249, A5 ₹749, A4 ₹1,499, A3 ₹2,999. When an item has more than one available size, the grid displays a price range and requires size selection before it can be added to the cart.

Product detail pages currently cover River Visitor, Iris Vase, Pansy Moths, Lazy Sunday, Boat & Trees, Tiger in the Swamp, Day Country, and Night Country.

## Customer-facing behaviour

- Country/currency preferences are stored in the browser and can be changed from the header.
- Product previews use supplied low-resolution web assets and preserve their source aspect ratios.
- Detail pages support a local magnifier and only render ratings/reviews where a verified review record exists.
- The cart is shared across current site pages through browser storage.
- Wishlist actions are reserved for a future logged-in customer identity; this prototype does not save real customer data.
- The two-page marketplace prototype stores admin unlock state, admin listings, demo customer login state, addresses, cart lines, and email-draft order records in `localStorage`.

## Operational notes

Product codes are maintained in `art-print.js` for future backend reference but are not displayed to customers. Customer data must not be collected or stored using the current static implementation. Before production, add consent records, a privacy policy, secure account handling, and server-side validation.

The marketplace prototype intentionally displays the OTP on screen because no email service is connected. Production OTP login requires server-generated expiring tokens, email delivery, rate limiting, abuse protection, server-side sessions, encrypted transport, and server-side address/order storage.
