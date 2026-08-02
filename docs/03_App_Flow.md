# 03 — Application Flow — v2
## URL Intelligence Platform

*Revision note: v2 expands the redirect flow (explicit cache-miss/cache-update steps) and analytics flow (capture → normalize → store → aggregate → dashboard), and adds sequence diagrams for Login, Redirect, Analytics, and QR Generation.*

---

## 1. High-Level User Journey

```
Landing Page
     │
     ▼
Register / Login ──────────────► Forgot Password
     │                                  │
     ▼                                  ▼
Dashboard (authenticated)      Reset Password Email
     │
     ├──► Create Short Link
     ├──► View / Search / Filter Links
     ├──► Open Link Detail (analytics, QR, settings)
     ├──► Favorites / Tags
     └──► Account Settings
```

---

## 2. Authentication Flow

```
User submits Register form
        │
        ▼
POST /register  → hash password (bcrypt) → save User → (optional) send verification email
        │
        ▼
POST /login → verify credentials
        │
        ▼
Issue Access Token (JWT, ~15 min) + Refresh Token (rotated, ~7–30 days, stored hashed in DB)
        │
        ▼
Client stores Access Token in memory, Refresh Token in httpOnly cookie (or secure storage)
        │
        ▼
On 401 (expired access token) → Axios interceptor calls POST /refresh
        │
        ▼
Valid refresh token → issue new access token (rotate refresh token)
Invalid/expired/reused refresh token → force logout, revoke all sessions, redirect to /login
```

### 2.1 Sequence Diagram — Login

```
Client            Spring API           Postgres            Redis
  │                    │                    │                  │
  │── POST /login ────►│                    │                  │
  │  {email, password} │                    │                  │
  │                    │── SELECT user ────►│                  │
  │                    │◄── user row ───────│                  │
  │                    │                    │                  │
  │                    │  bcrypt.verify()   │                  │
  │                    │                    │                  │
  │                    │── INCR fail-count ────────────────────►│  (only on failed attempt)
  │                    │                    │                  │
  │                    │  generate JWT access + refresh         │
  │                    │── INSERT refresh_token hash ──────────►│
  │                    │                    │                  │
  │◄── 200 OK ─────────│                    │                  │
  │  {accessToken,     │                    │                  │
  │   refreshToken}    │                    │                  │
```

---

## 3. Short Link Creation Flow

```
User submits: original URL [+ optional custom alias, expiry date, password, tags]
        │
        ▼
POST /urls
        │
        ▼
Validate URL format (well-formed http/https, ≤2048 chars, no javascript:/localhost — see TRD §7)
        │
        ▼
Check blacklist (domain not in blacklisted_domains)
        │
        ▼
   Custom alias provided?
   ├── Yes → check uniqueness + reserved-word list → if taken, 409 Conflict
   └── No  → generate Base62 short code from sequence/Snowflake ID → check uniqueness → retry on collision (max 3 attempts)
        │
        ▼
Hash password if provided (bcrypt)
        │
        ▼
Persist URL row (status = ACTIVE)
        │
        ▼
Return short URL + auto-generate QR code reference (201 Created)
```

---

## 4. Redirect Flow (Core Hot Path — Expanded)

**Full cache-aside sequence:**

```
GET /{shortCode}
        │
        ▼
Check Redis cache for shortCode
        │
   ┌────┴─────┐
   │  HIT     │  CACHE MISS
   ▼          ▼
Use cached    Query PostgreSQL by short_code (unique index)
original_url         │
   │                 ▼
   │          Found? ── No ──► 404 Not Found
   │                 │
   │                Yes
   │                 ▼
   │          Cache Update: SET shortCode → originalUrl (TTL ~1h)
   │                 │
   └────────┬────────┘
            ▼
   Link status checks:
   ├── EXPIRED (past expires_at)        → 410 Gone (friendly "expired" page)
   ├── DISABLED / UNDER_REVIEW          → 404 Not Found
   ├── PASSWORD_PROTECTED, not verified → return password-prompt view (no redirect yet)
   └── ACTIVE                           → proceed
            │
            ▼
   Rate-limit check (Redis counter per ip_hash) → over limit? → 429 Too Many Requests
            │
            ▼
   Emit click event ASYNCHRONOUSLY (does not block response):
        302 Redirect sent to client immediately
              └──► Queue analytics event → Background Worker (@Async) →
                   parse UA (browser/OS/device), hash IP, resolve country (optional) →
                   save click_events row
            │
            ▼
   Browser follows 302 → original URL
```

**Why this matters:** the cache-miss path explicitly repopulates the cache (cache-aside, not just a cache read), and status checks happen *after* the cache lookup but *before* the redirect is issued — expired/disabled links must never be served from a stale cache entry pointing to a URL, so the cached value is only the `original_url` mapping; status/expiry is always re-checked against the DB-derived state on each cache miss and periodically invalidated on update (see TRD §4/§12).

### 4.1 Sequence Diagram — Redirect (Cache Hit)

```
Client            Spring API              Redis              Postgres
  │                    │                    │                    │
  │── GET /abc123 ────►│                    │                    │
  │                    │── GET abc123 ─────►│                    │
  │                    │◄── originalUrl ────│                    │
  │                    │                    │                    │
  │                    │  check status/expiry (cached w/ TTL)     │
  │                    │  rate-limit check ─►│                    │
  │                    │◄── under limit ────│                    │
  │                    │                    │                    │
  │◄── 302 Redirect ───│                    │                    │
  │   Location: url    │                    │                    │
  │                    │── (async) enqueue click event ──────────►│
```

### 4.2 Sequence Diagram — Redirect (Cache Miss)

```
Client            Spring API              Redis              Postgres
  │                    │                    │                    │
  │── GET /abc123 ────►│                    │                    │
  │                    │── GET abc123 ─────►│                    │
  │                    │◄── (nil) ──────────│                    │
  │                    │                    │                    │
  │                    │── SELECT * FROM urls WHERE short_code ──►│
  │                    │◄── url row ───────────────────────────── │
  │                    │                    │                    │
  │                    │── SET abc123 (TTL 1h) ─►│                │
  │                    │                    │                    │
  │◄── 302 Redirect ───│                    │                    │
  │                    │── (async) enqueue click event ──────────►│
```

---

## 5. Password-Protected Link Flow

```
GET /{shortCode} → status shows PASSWORD_PROTECTED
        │
        ▼
Frontend renders password prompt page
        │
        ▼
POST /{shortCode}/verify { password }
        │
        ▼
Compare bcrypt hash
   ├── Match     → issue short-lived signed token/cookie scoped to this link → redirect (302) to original URL
   └── No match  → 401, increment failed-attempt counter (feeds rate limiting / CAPTCHA trigger, TRD §5.1)
```

---

## 6. Analytics Flow (Expanded: Capture → Normalize → Store → Aggregate → Dashboard)

```
Redirect request received
        │
        ▼
CAPTURE METADATA
   - Raw User-Agent string
   - Referrer header
   - Client IP (from request/X-Forwarded-For, validated against proxy trust config)
   - Timestamp
        │
        ▼
NORMALIZE
   - Parse User-Agent → browser name/version, OS, device type (desktop/mobile/tablet)
   - Hash IP → SHA-256(ip + salt) → ip_hash (raw IP discarded immediately, never persisted)
   - (Optional) Resolve country from IP before hashing (geolocation lookup happens on raw IP,
     in-memory only, before the hash-and-discard step)
        │
        ▼
STORE
   - Persist normalized click_events row: {url_id, timestamp, ip_hash, country, browser, device, os, referrer}
   - Write happens in a separate thread/transaction (@Async, REQUIRES_NEW) — isolated from the redirect response
        │
        ▼
AGGREGATE
   - On-demand aggregation queries for dashboard (v1): COUNT DISTINCT ip_hash, GROUP BY country/browser/device,
     time-bucketed COUNT for charts
   - (v2+) Pre-aggregated rollup table (click_stats_daily) populated by a scheduled job, so dashboards
     don't scan raw click_events once volume grows
        │
        ▼
DASHBOARD
   - GET /urls/{id}/analytics returns: total clicks, unique visitors, last accessed,
     breakdowns (country/browser/device), time-series data for charts
   - Frontend renders via Chart.js/Recharts; polls every 15–30s for near-real-time feel (React Query refetchInterval)
```

### 6.1 Sequence Diagram — Analytics Dashboard Load

```
Client            Spring API              Postgres
  │                    │                    │
  │── GET /urls/{id}/analytics ────────────►│  (JWT verified, ownership checked)
  │                    │── aggregation query(ies) ──►│
  │                    │◄── totals, breakdowns, series │
  │◄── 200 OK ─────────│                    │
  │  { totalClicks,     │                   │
  │    uniqueVisitors,  │                   │
  │    byCountry[],     │                   │
  │    byBrowser[],     │                   │
  │    timeSeries[] }   │                   │
```

---

## 7. QR Code Flow

### 7.1 Sequence Diagram — QR Generation

```
Client            Spring API
  │                    │
  │── GET /urls/{id}/qr ──────►│  (JWT verified, ownership checked)
  │                    │
  │                    │  fetch url.short_code → build full short URL
  │                    │  generate QR (ZXing or similar) encoding the short URL
  │                    │  stream PNG bytes
  │                    │
  │◄── 200 OK (image/png) ─────│
```

Frontend displays the returned PNG inline with a "Download" button (`<a download>` on the blob/object URL).

---

## 8. Rate Limiting & Abuse Detection Flow (Stretch)

```
Incoming request (redirect or write endpoint)
        │
        ▼
Redis: check counter for key (ip_hash or userId) under chosen algorithm (TRD §6)
   ├── Under limit  → INCR counter, proceed
   └── Over limit   → 429 Too Many Requests (+ Retry-After header)
        │
        ▼
Suspicious pattern detected (excessive clicks/IP, redirect loop)
        │
        ▼
Mark link status = UNDER_REVIEW (not hard-blocked)
        │
        ▼
Admin Panel surfaces flagged links for manual review
```

---

## 9. Admin Flow

```
Admin login (role = ADMIN)
        │
        ▼
Admin Panel
   ├── View flagged / under-review links → approve or disable
   ├── Ban user → cascades to disabling their active links
   └── Manage blacklisted domains → add/remove entries used at link-creation time
```

---

## 10. Cross-Cutting: Error Handling Flow

```
Any API error
        │
        ▼
Global @ControllerAdvice / @ExceptionHandler
        │
        ▼
Map exception → standardized error response { timestamp, status, error, message, path }
   (full status-code table in 02_TRD.md §8)
        │
        ▼
Client (Axios interceptor) → shows toast/inline error, triggers refresh flow if 401
```
