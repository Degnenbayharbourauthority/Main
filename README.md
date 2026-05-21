# Degnen Bay Harbour Authority Website

## Files

Upload these files to your GitHub repository:

- `index.html`
- `functions/api/register.js`
- `logo.svg` — your logo file
- `banner.jpg` — your harbour banner photo

## Cloudflare Pages setup

1. Create a GitHub repository and upload the files.
2. In Cloudflare, create a Pages project from the GitHub repository.
3. Add these environment variables in Cloudflare Pages:
   - `TURNSTILE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`

Example `FROM_EMAIL`:
`Degnen Bay Harbour Authority <registration@degnenbayharbourauthority.ca>`

You need to verify your domain in Resend before sending from that address.

## Turnstile setup

1. In Cloudflare, go to Turnstile.
2. Create a new widget for your website domain.
3. Copy the Site Key into `index.html`, replacing:
   `YOUR_TURNSTILE_SITE_KEY`
4. Copy the Secret Key into the Cloudflare Pages environment variable:
   `TURNSTILE_SECRET_KEY`

## Email setup

This version uses Resend to send the registration email to:

`registration@degnenbayharbourauthority.ca`

Create a Resend API key and add it to Cloudflare Pages as:

`RESEND_API_KEY`
