# AGENT.md

## Project purpose

MissMoodyTiger is a small-run art-print storefront and artist website. The current repository is intentionally a lightweight, static, local-first prototype built with plain HTML, CSS, and browser JavaScript.

The site should feel like a distinctive independent artist storefront, not a generic SaaS or template ecommerce site. Preserve the existing visual language, typography, spacing, hand-made character, and editorial presentation unless the task explicitly asks for a redesign.

## Current architecture

- Plain HTML pages at the repository root.
- `styles.css` contains the shared visual system and responsive styles.
- `navigation.js` owns shared navigation/header behaviour, currency controls, cart count, and some catalogue augmentation.
- `script.js` owns catalogue/home interactions and local cart/wishlist behaviour.
- `art-print.js` owns the shared product-detail route, catalogue data, size selection, price display, preview magnifier, wishlist action, and prototype review rendering.
- `cart.js` owns cart rendering, quantities, totals, and removal.
- `checkout-terms.js` gates checkout through Terms & Conditions acknowledgement.
- `assets/` contains web-resolution storefront media.
- `docs/` documents architecture, website behaviour, and intended data models.

Before making a non-trivial architectural change, read:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODELS.md`
- `docs/WEBSITE_INFORMATION.md`

## Development principles

1. **Prefer the smallest change that solves the task.**
   Do not introduce React, Vue, Next.js, build systems, package managers, component libraries, hosted CMSs, or other framework dependencies unless explicitly requested.

2. **Preserve the current stack.**
   Use semantic HTML, CSS, and vanilla browser JavaScript for storefront work unless a task specifically requires a different architecture.

3. **Do not over-engineer the prototype.**
   Avoid abstractions, utility layers, configuration systems, and dependencies that are not justified by current functionality.

4. **Keep customer-facing behaviour coherent across pages.**
   Shared concerns such as navigation, cart count, currency display, route state, and visual patterns should remain consistent.

5. **Respect the existing brand system.**
   Reuse the CSS variables, fonts, borders, editorial layouts, and deliberately imperfect/hand-made visual treatment already present. New UI should look native to MissMoodyTiger rather than like a generic ecommerce component.

6. **Mobile behaviour matters.**
   Changes must remain usable at the existing mobile breakpoint and must not break desktop layout.

## Ecommerce rules

### Product data

The current product catalogue is defined in browser JavaScript. Maintain stable product IDs and internal product codes when editing products.

Product codes are internal references and should not be exposed to customers unless explicitly required.

When changing products, sizes, prices, titles, or preview images, check every affected surface:

- catalogue cards
- product-detail page
- cart
- currency display
- documentation where the same information is described

Avoid duplicating product truth in additional places unless necessary. If duplication already exists, keep values synchronized.

### Prices and currency

- INR is the current base pricing concept.
- Other currencies are presentation conversions only in the prototype.
- Do not imply that client-side currency conversion is suitable for production checkout.
- Do not move authoritative production pricing into browser-only logic.

### Cart and wishlist

The current cart and wishlist are prototype browser-state features backed by `localStorage`.

Do not treat `localStorage` as a secure or authoritative source for:

- paid orders
- inventory
- customer identity
- addresses
- payment state
- fulfilment state
- verified reviews
- consent records

## Production boundary

The repository currently does **not** contain a production ecommerce backend.

Features involving real money, personal data, authentication, inventory, fulfilment, order status, verified reviews, or customer records must be designed around a secure server-side source of truth.

Never implement fake production security using only browser JavaScript or hidden fields.

Do not store passwords, payment credentials, sensitive customer data, OTPs, or authoritative order records in `localStorage`.

If a requested feature crosses this boundary, separate the work into:

1. safe storefront/UI work that can live in the current static client; and
2. backend/API work required for production correctness.

The intended future production direction is a self-hosted backend/API with server-side validation and a database, as described in `docs/ARCHITECTURE.md` and `docs/DATA_MODELS.md`.

## Payments

Do not create pretend payment success flows.

For real payment integrations:

- payment amounts and order contents must be validated server-side;
- payment-provider secrets must never be embedded in client-side code;
- webhook/signature verification belongs on the server;
- payment success in the browser alone must never mark an order as paid.

Domestic and international payment methods may eventually differ. Keep payment-provider-specific logic isolated enough that additional providers can be added later.

## Orders, inventory, and fulfilment

Future operational modules should treat the server as authoritative for:

- order ID and timestamps
- payment status
- fulfilment status
- customer/shipping address snapshot
- order lines and selected print sizes
- quantity
- product/SKU reference
- inventory deductions
- shipping method
- AWB/tracking number
- packing/dispatch status

When building fulfilment functionality, prefer an explicit state flow such as:

`new/paid -> ready to pack -> packed -> label generated -> dispatched -> delivered`

The admin experience should make it difficult to miss an order or pack the wrong item. Packing views should clearly associate the order, customer, address, artwork, size, and quantity before an order can be marked packed or dispatched.

Shipping-label data should come from the same authoritative order/address record used for fulfilment rather than from separately retyped fields.

## Artwork and media

Artwork previews are intentionally web-resolution assets.

- Do not replace them with unnecessarily high-resolution originals.
- Preserve source aspect ratios unless a task explicitly requires cropping.
- Use meaningful `alt` text.
- Do not claim that front-end code can prevent screenshots or guarantee copyright protection.
- Avoid exposing private production artwork files through public routes.

## Accessibility and interaction

For new UI:

- prefer semantic elements;
- keep keyboard access working;
- add visible focus treatment for interactive elements;
- provide appropriate labels/ARIA where native semantics are insufficient;
- do not rely on hover alone for essential actions;
- keep text readable and controls usable on mobile.

## JavaScript conventions

- Prefer clear, browser-native JavaScript.
- Use `const` by default and `let` only where reassignment is required.
- Keep functions focused and names descriptive.
- Avoid global variables when an IIFE or small scoped module is sufficient.
- Avoid adding dependencies for functionality that can be implemented cleanly with browser APIs.
- Guard DOM lookups where a script may run across multiple pages.
- Do not silently swallow errors in flows involving customer or order data.

When injecting HTML from dynamic or future server-provided content, do not interpolate untrusted data into `innerHTML`. Use DOM APIs or escaping/sanitization appropriate to the source.

## CSS conventions

- Reuse existing custom properties in `:root` where possible.
- Extend existing patterns before adding a parallel design system.
- Keep responsive rules compatible with the existing `760px` mobile breakpoint unless there is a strong reason to change it.
- Avoid introducing arbitrary colors, shadows, radii, or type styles that fight the established visual language.
- Prefer class-based rules over inline styles for reusable UI.

## Documentation

Update documentation when a change materially changes:

- site routes
- module responsibilities
- product data structure
- storage behaviour
- architecture
- production boundaries
- customer-facing behaviour

Keep documentation factual. Clearly distinguish between what exists now and what is only a planned production capability.

## Testing and verification

There is no framework test suite documented for the current static prototype. For storefront changes, perform targeted manual verification using a local HTTP server.

Recommended local run command:

```sh
python3 -m http.server 4173
```

Then verify the affected routes at `http://127.0.0.1:4173/`.

At minimum, check relevant changes for:

- browser console errors
- broken links and missing assets
- desktop layout
- mobile layout
- keyboard interaction where applicable
- cart state across pages
- size and price consistency
- currency display where affected
- `localStorage` migrations or compatibility if storage structures changed

For checkout-, auth-, order-, or payment-related work, explicitly state which behaviour is only prototype UI and which behaviour has been validated server-side.

## Change discipline

- Do not rewrite unrelated files.
- Do not perform broad formatting passes unless requested.
- Do not rename established routes, product IDs, storage keys, or internal codes casually.
- Preserve backwards compatibility with existing `localStorage` data when practical; otherwise document or implement a migration.
- Avoid destructive changes to artwork/assets.
- Keep commits and diffs focused on the requested feature or fix.

## Important current storage keys

Existing prototype behaviour uses keys including:

- `mmt-cart`
- `mmt-country`
- `mmt-unit`
- `mmt-wishlist`
- `mmt-user`
- `mmt-verified-reviews`

Treat these as public client-side prototype state, not secure records.

## Definition of done

A change is complete when:

- it solves the requested behaviour without unnecessary architectural expansion;
- it matches the existing MissMoodyTiger visual language;
- affected desktop and mobile routes still work;
- product/cart/currency data remains internally consistent;
- no sensitive or authoritative ecommerce state has been moved into insecure browser storage;
- production-only claims are not presented as implemented when they are not;
- relevant documentation is updated when architecture or behaviour changed.
