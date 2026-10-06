# Scholara
Static site (index.html) + Vercel serverless function (api/quote.js) that emails each request via Resend.
Env vars (Vercel → Settings → Environment Variables): RESEND_API_KEY, FROM_EMAIL, TO_EMAIL.
Prices: edit pricing.config.js. Reviews are still a localStorage demo.
Limit: Vercel functions accept ~4.5 MB bodies; the form caps files at 4 MB.
