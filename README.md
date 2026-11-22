# Sirsi Dryclean website

A mobile-friendly static website with ironing and dry-cleaning price lists, instant demo estimate, Call and WhatsApp buttons. No paid services, account sign-up, build tools, or backend needed.

## Shop details

- **Name:** Sirsi Dryclean
- **Contact:** +91 72199 09630
- **WhatsApp:** https://wa.me/917219909630

## Owner Price Manager

- Admin login (free): https://sirsi-dryclean.pages.dev/admin/ (legacy owner URL still supported: https://sirsi-dryclean.pages.dev/owner/)
- Admin login: password-protected with HTTP-only, Secure, SameSite=Strict sessions. No demo credentials in code.
- First owner password hash: Cloudflare Pages secret `OWNER_PASSWORD_HASH`. Share the initial password only with the shop owner, who can change it after login.
- Owner can **add, edit, remove garments** and update **Ironing** and **Dry Cleaning** prices and item units.
- Tap **Save prices** to store changes in Cloudflare D1. Visitors see new prices from `/api/prices` on refresh; no redeploy required.
- Public price list starts in **demo mode**. After checking every rate, select **Verified rates** and save to publish the verified-price label.
- Owner can change the login password; this invalidates all existing sessions.
- API endpoints: public `GET /api/prices`; private `GET/PUT /api/admin/prices`; login, logout, login status, password rotation.
- Database: `sirsi-dryclean-prices`, binding `PRICE_DB` (production and preview).

**Important:** Do not share the owner password publicly. Prices are shop-maintained information and actual service availability is confirmed on WhatsApp or phone.

## IMPORTANT: Replace sample prices before publishing

The garment rates in `index.html` are **demo placeholders, not verified shop prices**. Sign in to **Owner Price Manager** to edit each rate. Public price data comes from D1, not the static fallback in `index.html`. Do not edit static fallback rates as the primary mechanism. After shop rates are verified, you may remove the highlighted demo price notice and change `demo` labels as appropriate.

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

Customer website code is in `index.html`; admin page is in `admin/index.html` (legacy owner page is in `owner/index.html`); server endpoints are in `functions/`. Live prices are stored in D1. No installation needed. Phone button uses `tel:+917219909630` and WhatsApp uses `https://wa.me/917219909630`.

## Booking behavior

This website only creates a WhatsApp message. It does **not** process payments, persist customer information, guarantee availability, or actually place orders without the shop confirming through WhatsApp.