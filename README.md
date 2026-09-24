# saffar — Uzbekistan Silk Road stays

A full clone-style booking site: landing page, stays listing with a live map panel,
and a real sign in / create account flow backed by a Node.js API.

## What's inside

```
saffar-app/
  backend/            Node + Express API (auth, users, stays)
    server.js
    package.json
    users.json         <- tiny file-based user "database"
  public/              Frontend (served by the backend, or any static server)
    index.html          Landing page
    stays.html           Listing page with map panel
    login.html            Sign in (email + password, map on the right)
    signup.html             Create account (name, email, password x2, map on the right)
    account.html              Shows the signed-in user's own data
    css/style.css
    js/partials.js, auth.js, map.js
```

## Run it

```bash
cd saffar-app/backend
npm install
npm start
```

The server prints `saffar backend running on http://localhost:4000` and also serves
the frontend, so open **http://localhost:4000** in your browser — everything
(pages + API) comes from that one address.

If you'd rather run the frontend separately (e.g. VS Code Live Server), it still
works: `js/auth.js`, `js/partials.js` and `stays.html` call the API at
`http://localhost:4000` directly. Just make sure the backend is running.

## How auth works

- **Create account** (`signup.html`): asks for full name, email, and the password
  typed twice. Both entries are checked to match before the request is sent.
- **Sign in** (`login.html`): asks for email and password.
- On success, the backend returns a signed token (JWT) and the user's own record.
  The frontend stores the token and redirects to `account.html`, which fetches
  `/api/me` and displays the name, email, member-since date, and account id —
  i.e. the data you just entered.
- Passwords are hashed with bcrypt before being written to `users.json`; the
  server never stores or returns the raw password.
- `users.json` is a plain JSON file so you can inspect it while developing.
  Swap `readUsers`/`writeUsers` in `server.js` for a real database
  (Postgres, MongoDB, etc.) when you're ready to go to production.

## Notes

- The map on the auth pages and the stays listing is an illustrated SVG
  (Tashkent, Samarkand, Bukhara, Khiva, Nukus, Chimgan pins) generated in
  `js/map.js` — no external map API key required.
- Photos on the landing/listing pages are placeholder Unsplash images; swap the
  URLs in `index.html` / `stays.html` for your own listing photos.
