# Data models

The current site is a front-end prototype. The first four models below are browser-local representations, not a production database. The remaining models are recommended server-side models for a safe production build.

## Current browser-local models

### Product catalogue

Defined in `art-print.js`.

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `id` | string | `pansy` | Stable route identifier. |
| `name` | string | `Pansy Moths` | Customer-facing title. |
| `image` | path string | `assets/pansy-preview.png` | Low-resolution preview only. |
| `code` | string | `MMT-ART-PMY-003` | Internal reference; not rendered to customers. |
| `sizes` | object | `{ A6: 249, A5: 749 }` | INR base price by paper size. |
| `medium` | string | `Digital illustration reproduced as a fine art print.` | Product description field. |
| `description` | string | artwork description | Product overview field. |

### Cart (`mmt-cart`)

Stored in `localStorage` as an object keyed by product id.

```json
{
  "pansy": { "name": "Pansy Moths", "price": 3, "qty": 1 }
}
```

`price` is currently held in the legacy USD-equivalent value used for display conversion. Production must store price snapshots, currency, selected size, tax, and order line references on the server.

### Preferences

| Key | Purpose |
| --- | --- |
| `mmt-country` | Selected country/currency code: `IN`, `US`, `GB`, or `EU`. |
| `mmt-unit` | Persistent paper-dimension display preference. |
| `mmt-wishlist` | Browser-local product-id list for a future signed-in user. |
| `mmt-user` | Placeholder display identity only; do not treat as authentication. |
| `mmt-verified-reviews` | Demonstration-only review map; no records are seeded. |
| `mmt-market-listings` | Prototype admin-created listings with image data, description, price, dimensions, and status. |
| `mmt-market-otp` | Preview-only OTP value shown on screen; production must email a hashed, expiring token from a server. |
| `mmt-market-customer` | Preview customer session created after demo OTP verification. |
| `mmt-market-addresses` | Preview address book. Do not store real customer addresses in browser-only production code. |
| `mmt-market-orders` | Preview orders created by the customer-facing shop. |

## Recommended production models

### Customer

`id`, `email`, `email_verified_at`, `name`, `phone_e164` (optional), `whatsapp_opt_in`, `sms_opt_in`, `address`, `avatar_url` (optional), `marketing_opt_in`, `created_at`, `updated_at`.

### Account credential

`customer_id`, `password_hash` (Argon2id), `password_updated_at`, `two_factor_enabled`, `created_at`. Never store a password in plaintext.

### Verification token / OTP

`id`, `customer_id`, `channel`, `token_hash`, `expires_at`, `attempt_count`, `used_at`, `created_at`. Store a hash of the token, rate-limit attempts, and expire unused tokens.

### Order and order line

Order: `id`, `customer_id`, `status`, `currency`, `subtotal`, `shipping`, `tax`, `total`, `terms_accepted_at`, `terms_version`, `shipping_address_snapshot`, `created_at`.

Order line: `id`, `order_id`, `product_id`, `product_code`, `product_name_snapshot`, `selected_size`, `unit_price_snapshot`, `quantity`.

### Address

`id`, `customer_id`, `name`, `line1`, `line2`, `city`, `region`, `postal_code`, `country`, `phone_e164`, `is_default`, `created_at`, `updated_at`. Production address records must be stored server-side and protected by customer authorization.

### Review

`id`, `order_line_id`, `customer_id`, `rating` (1–5), `body`, `image_urls`, `status`, `published_at`, `created_at`. Only orders with a delivered, verified line item should be eligible to submit a review.

## Security and privacy requirements

Use server-side authorization for all personal data, review eligibility, prices, orders, and marketing consent. Encrypt data in transit, use a managed or self-hosted transactional email/SMS provider with audit logs, and restrict customer-report analytics to authorized studio roles.
