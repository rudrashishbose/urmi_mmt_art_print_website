# MissMoodyTiger storefront

A static, local-first art-print storefront for MissMoodyTiger. It uses plain HTML, CSS, and browser JavaScript—there are no paid plugins, hosted databases, or third-party authentication services in the current prototype.

## Run locally

```sh
cd outputs/missmoodytiger-site
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Documentation

- [Website information](docs/WEBSITE_INFORMATION.md)
- [Data models](docs/DATA_MODELS.md)
- [Storefront architecture](docs/ARCHITECTURE.md)

## Important implementation status

This is a storefront prototype. Cart, preferred currency, wishlist, unit preference, review rendering, admin listings, demo OTP state, customer session, saved addresses, and email-draft order records use browser `localStorage`. No customer account, email verification, OTP, SMS, WhatsApp, order fulfilment, or analytics data is currently sent to a server. Production deployment requires a secure, self-hosted backend and legal/privacy review.

Preview images are deliberately web-resolution assets. Browser or device screenshots cannot be technically prevented; do not rely on client-side code as copyright protection.
