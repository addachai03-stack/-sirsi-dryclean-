# Sirsi Dryclean website

A mobile-friendly static website with ironing and dry-cleaning price lists, instant demo estimate, Call and WhatsApp buttons. No paid services, account sign-up, build tools, or backend needed.

## Shop details

- **Name:** Sirsi Dryclean
- **Contact:** +91 72199 09630
- **WhatsApp:** https://wa.me/917219909630

## IMPORTANT: Replace sample prices before publishing

The garment rates in `index.html` are **demo placeholders, not verified shop prices**. Search for `const PRICES = {` near the end of `index.html`. Edit each `price:` number with your real rates. After shop rates are verified, you may remove the highlighted demo price notice and change `demo` labels as appropriate.

No store address, hours, pickup, or delivery commitment is shown because those details have not been provided.

## Cloudflare Pages hosting (connected to GitHub)

- Cloudflare Pages project: `sirsi-dryclean`
- Cloudflare Pages URL: https://sirsi-dryclean.pages.dev/
- Connected repository: `addachai03-stack/-sirsi-dryclean-` (`main` branch)
- Static site; automatic production deployment is enabled for new GitHub commits.
- The sample prices must be confirmed with the shop before treating them as final.

## Optional GitHub Pages hosting (iPhone compatible)

1. On GitHub, create a **public** repository named `-sirsi-dryclean-`.
2. Add `index.html`, `favicon.svg`, and this README in the **root** (not a nested folder).
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
4. Once published, your expected URL will be `https://addachai03-stack.github.io/-sirsi-dryclean-/`.

Note: GitHub account/organization policies may affect free Pages availability. The site itself is fully static.

## Editing

All design, price-list, and interaction code is contained in `index.html`. No installation needed. Phone button uses `tel:+917219909630` and WhatsApp uses `https://wa.me/917219909630`.

## Booking behavior

This website only creates a WhatsApp message. It does **not** process payments, persist customer information, guarantee availability, or actually place orders without the shop confirming through WhatsApp.