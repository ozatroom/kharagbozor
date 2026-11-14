# KHARAGBOZOR

Bilingual (Russian / Tajik) storefront starter for Dushanbe, Tajikistan.

## Current MVP
- Responsive storefront layout
- Russian / Tajik language switch
- Product catalog with sample/demo products
- Category filters and product search
- Shopping cart with quantity controls
- Checkout form collecting customer name, phone, and delivery address

## Important: demo status
This is a frontend MVP. Checkout currently validates the form and logs a demo order in the browser console. It does **not** transmit orders to a store owner, Telegram, CRM, or payment provider. Product names, images, and prices are sample content and must be replaced with real store inventory.

Do not collect real customer orders until a secure backend and privacy notice are configured. Never put Telegram bot tokens, payment secrets, or private API keys in frontend files.

## Deploy on Cloudflare Pages
1. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Connect GitHub and select `ozatroom/kharagbozor`.
3. Framework preset: **None**.
4. Build command: leave empty.
5. Build output directory: `/` (repository root).
6. Deploy.

After deployment, add a custom domain in the Pages project settings if you own one.

## Next production steps
- Add Cloudflare Worker API and D1 database for products and orders.
- Add secure admin authentication and product/order management.
- Add Telegram notifications using server-side secrets.
- Integrate a supported local payment provider only after merchant credentials and API documentation are available.
- Add delivery pricing, terms, privacy policy, and real product inventory.
