# Degnen Bay Harbour Authority - Cloudflare Pages Site

This is a static Cloudflare Pages site with a Pages Function that emails visitor registrations through **Cloudflare Email Routing**, not Zoho SMTP and not a paid third-party email service.

The form sends registrations to:

registration@degnenbayharbourauthority.ca

## Setup steps

1. Upload this folder to GitHub, then connect it to Cloudflare Pages.
2. In Cloudflare, enable **Email Routing** for `degnenbayharbourauthority.ca`.
3. Make sure `registration@degnenbayharbourauthority.ca` is a verified Email Routing address or route.
4. In Cloudflare, create a **Turnstile** widget for your domain.
5. Replace `YOUR_TURNSTILE_SITE_KEY` in `index.html` with your Turnstile site key.
6. In Cloudflare Pages, add this environment variable:
   - `TURNSTILE_SECRET_KEY` = your Turnstile secret key
7. Add a Cloudflare **Send Email binding** named `SEND_EMAIL`, with destination address:
   - `registration@degnenbayharbourauthority.ca`

A `wrangler.toml` file is included with this binding:

```toml
[[send_email]]
name = "SEND_EMAIL"
destination_address = "registration@degnenbayharbourauthority.ca"
```

If the Pages dashboard does not show Send Email bindings, deploy with Wrangler or move the form handler to a small Cloudflare Worker using the same `functions/api/register.js` logic.

## Anti-bot protections included

- Cloudflare Turnstile widget
- Server-side Turnstile validation
- Hidden honeypot field
- Server-side required-field validation
- Server-side date check so users cannot reserve in advance

For extra protection, add a Cloudflare WAF/rate limit rule for path `/api/register`, such as blocking or challenging repeated POST requests from the same IP.

## Notes

Cloudflare's Send Email binding requires Email Routing to be enabled and the destination email to be verified in Cloudflare. The sender must be from the domain where Email Routing is active.
