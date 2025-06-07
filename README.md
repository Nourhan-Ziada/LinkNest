# LinkNest – Smart Link Shortener

A smart and minimal link shortener API built with Node.js, Express, Drizzle ORM, and SQLite. LinkNest allows users to create shortened links, track visits, set expiration dates, protect links with passwords, and more.

---

## Features

- **Create a short URL** for any long URL (with optional custom slug).
- **Track visit count** for each short link.
- **Redirect** to the original URL on slug visit.
- **Expire links** after a specific date (returns HTTP 410 if expired).
- **Password-protected links** (optional).
- **Generate QR code** for each short link.
- **Session-based user authentication** (via [better-auth](https://www.npmjs.com/package/better-auth)).
- **Input validation** using Zod.
- **Rate limiting** to prevent abuse.
- **Logging** with Morgan.
- **GeoIP tracking** for visits.

---

## Project Structure

```
src/
  app.js                # Express app setup
  server.js             # Server entry point
  controllers/
    link.controller.js  # Link-related request handlers
  database/
    db.js               # Drizzle ORM and SQLite setup
    migrations/         # Database migrations
  middlewares/
    logger.js           # Morgan logger middleware
    rateLimiter.js      # Express-rate-limit middleware
    zodValidator.js     # Zod validation middleware
    linkExpiry.js       # Link expiry check middleware
  models/
    link.model.js       # Drizzle schema for links
    user.model.js       # Drizzle schema for users
    visit.model.js      # Drizzle schema for visits
  routes/
    link.routes.js      # Express routes for link operations
  schemas/
    link.schema.js      # Zod schemas for validation
  services/
    link.service.js     # Business logic for links
  utils/
    auth.js             # better-auth setup
    qrcode.js           # QR code generation utility
    slug.js             # Slug generation utility
```

---

## Main Endpoints

### Link Management

- `POST /api/links`
  - Create a new short link.
  - Body:  
    ```json
    {
      "originalUrl": "https://...",
      "customSlug": "optional",
      "expiresAt": "optional (YYYY-MM-DD or ISO format)",
      "password": "optional"
    }
    ```
- `GET /api/links/:shortSlug`
  - Redirect to the original URL (returns 302 or JSON for demo).
- `GET /api/links/:shortSlug/qrcode`
  - Get a QR code for the short link.

### Authentication

- `POST /api/auth/register`
  - Register a new user (handled by better-auth).
- `POST /api/auth/login`
  - Login (handled by better-auth).
- `GET /api/auth/me`
  - Get current user info (requires authentication).

---

## Middlewares

- **Logger:** Logs all requests using Morgan (`middlewares/logger.js`).
- **Zod Validation:** Validates request bodies and params (`middlewares/zodValidator.js`).
- **Rate Limiting:** Limits link creation requests per IP (`middlewares/rateLimiter.js`).
- **Link Expiry Check:** Returns 410 Gone if a link is expired (`middlewares/linkExpiry.js`).
- **Auth Middleware:** Session-based authentication using better-auth (`utils/auth.js`).

---
## Database Schema (ERD)

- **users_table:**  
  `id`, `email`, `hashed_password`, `created_at`
- **links_table:**  
  `id`, `original_url`, `short_slug`, `created_by`, `created_at`, `expires_at`, `click_count`, `password_hash`
- **visits_table:**  
  `id`, `link_id`, `ip_address`, `user_agent`, `referrer`, `country`, `clicked_at`

---

## How It Works

- **Shorten a Link:**  
  Send a POST request to `/api/links` with a valid URL. Optionally, set a custom slug, expiration date, or password.
- **Redirect:**  
  Visiting `/api/links/:shortSlug` will redirect (or respond with) the original URL if the link is valid and not expired.
- **Track Visits:**  
  Each visit logs IP, country, referrer, and user-agent.
- **Password Protection:**  
  If a password is set, the user must provide it in the `x-password` header.
- **Expiration:**  
  Expired links return HTTP 410.
- **QR Code:**  
  Get a QR code for any short link via `/api/links/:shortSlug/qrcode`.
- **Validation:**  
  All input is validated using Zod schemas before processing.

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your variables (e.g., `PORT`, `BASE_URL`, `JWT_SECRET`).

3. **Run migrations:**
   ```sh
   npx drizzle-kit push:sqlite
   ```

4. **Start the server:**
   ```sh
   npm run dev
   ```

5. **Test endpoints** using Postman or curl.

---

## Planned/Additional Features

- Block specific IPs or referrers.
- Admin dashboard for managing links and analytics (AdminLTE).
- More advanced analytics.
- Custom domains for short links.

---

## References

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [better-auth Docs](https://www.better-auth.com/docs/introduction)
- [Zod Docs](https://zod.dev/)
- [Express Docs](https://expressjs.com/)

---

*Feel free to contribute or suggest features!*
```

