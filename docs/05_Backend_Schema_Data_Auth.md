# 05 — Backend Schema, Data Model & Authentication — v2
## URL Intelligence Platform

*Revision note: v2 adds explicit foreign key/cascade rules, indexing rationale, full API contracts (headers, request/response bodies, status codes) per endpoint, and a complete error-response reference.*

---

## 1. Database Schema (PostgreSQL)

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL / UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | **UNIQUE, NOT NULL**, indexed |
| password_hash | VARCHAR(255) | NOT NULL, bcrypt |
| role | VARCHAR(20) / ENUM | NOT NULL, default `USER` (`USER`, `ADMIN`) |
| email_verified | BOOLEAN | default `false` |
| status | VARCHAR(20) / ENUM | `ACTIVE`, `BANNED` — default `ACTIVE` |
| created_at | TIMESTAMP | default `now()` |

### `urls`
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL / UUID | PK |
| user_id | BIGINT | **FK → users.id, ON DELETE CASCADE**, indexed |
| original_url | TEXT | NOT NULL, validated (TRD §7) |
| short_code | VARCHAR(30) | **UNIQUE, NOT NULL**, indexed |
| password_hash | VARCHAR(255) | nullable, bcrypt |
| expires_at | TIMESTAMP | nullable |
| status | VARCHAR(20) / ENUM | `ACTIVE`, `EXPIRED`, `DISABLED`, `UNDER_REVIEW` — default `ACTIVE` |
| created_at | TIMESTAMP | default `now()` |

**Cascade rule rationale:** deleting a user cascades to deleting their `urls` — a user's links are owned data with no independent meaning once the account is gone. This is a deliberate choice over `ON DELETE SET NULL`, since an orphaned short link with no owner is a liability (nobody can manage/disable it) rather than a useful artifact.

### `click_events`
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PK |
| url_id | BIGINT | **FK → urls.id, ON DELETE CASCADE**, indexed |
| timestamp | TIMESTAMP | NOT NULL, indexed |
| ip_hash | VARCHAR(64) | NOT NULL (SHA-256 hex) |
| country | VARCHAR(2) | nullable (ISO country code) |
| browser | VARCHAR(50) | nullable |
| device | VARCHAR(20) | nullable (`desktop`/`mobile`/`tablet`) |
| os | VARCHAR(50) | nullable |
| referrer | VARCHAR(2048) | nullable |

**Cascade rule rationale:** deleting a `url` cascades to deleting its `click_events` — analytics data has no meaning independent of the link it measures. (In a real production system, you might instead soft-delete the URL and retain historical analytics for reporting; documented here as a deliberate v1 simplification, revisited in the scaling note below.)

### `blacklist`
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PK |
| domain | VARCHAR(255) | **UNIQUE, NOT NULL** |
| reason | VARCHAR(255) | nullable |
| created_at | TIMESTAMP | default `now()` |

### `refresh_tokens`
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PK |
| user_id | BIGINT | **FK → users.id, ON DELETE CASCADE**, indexed |
| token_hash | VARCHAR(255) | NOT NULL, unique |
| expires_at | TIMESTAMP | NOT NULL |
| revoked | BOOLEAN | default `false` |
| created_at | TIMESTAMP | default `now()` |

### `api_keys` (optional, future public API)
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PK |
| user_id | BIGINT | **FK → users.id, ON DELETE CASCADE** |
| key_hash | VARCHAR(255) | NOT NULL, unique |
| quota | INT | default value per plan |

---

## 2. Indexing Strategy (with Rationale)

| Index | Why |
|---|---|
| `urls.short_code` (UNIQUE) | This is the **redirect hot path** lookup — every single redirect request queries by this column. Without a unique index this degrades to a full table scan under load, directly violating the p95 latency NFR. |
| `urls.user_id` | Powers the "list my links" dashboard query, which is filtered by owner on every dashboard load. |
| `click_events.url_id` | Every analytics aggregation (`GROUP BY url_id`) filters on this first. |
| `click_events.timestamp` (composite with `url_id`: `(url_id, timestamp)`) | Time-range chart queries (`WHERE url_id = ? AND timestamp BETWEEN ? AND ?`) benefit from a composite index that supports both the equality filter and the range scan in one pass. |
| `users.email` (UNIQUE) | Login is a lookup by email; uniqueness constraint also enforces the "one account per email" business rule at the DB layer, not just the application layer. |
| `blacklist.domain` (UNIQUE) | Link-creation-time blacklist check is a point lookup; uniqueness also prevents duplicate entries. |

**Execution plan awareness:** for the redirect query (`SELECT * FROM urls WHERE short_code = ?`), `EXPLAIN ANALYZE` should show an **Index Scan** (or **Index Only Scan** if all needed columns are covered), never a **Seq Scan** — this is the single query worth periodically re-verifying as the table grows, since a missing or degraded index here directly breaks the core performance NFR.

---

## 3. Entity Relationships

```
users (1) ──────< (many) urls            [ON DELETE CASCADE]
urls  (1) ──────< (many) click_events     [ON DELETE CASCADE]
users (1) ──────< (many) refresh_tokens   [ON DELETE CASCADE]
users (1) ──────< (many) api_keys         [ON DELETE CASCADE, optional]
blacklist  — independent lookup table, checked at url-creation time
```

---

## 4. Standard Error Response Shape

```json
{
  "timestamp": "2026-08-02T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Short link does not exist or has been disabled",
  "path": "/xa29kd"
}
```

Full status-code usage table lives in `02_TRD.md` §8; every endpoint below references the relevant codes.

---

## 5. API Contracts (Full Detail)

### 5.1 Authentication

#### `POST /api/auth/register`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Anike Sharma",
  "email": "anike@example.com",
  "password": "SecurePass123"
}
```
**Responses:**
- `201 Created` → `{ "id": 1, "name": "Anike Sharma", "email": "anike@example.com" }`
- `409 Conflict` → email already registered
- `422 Unprocessable Entity` → validation failure (weak password, malformed email)

#### `POST /api/auth/login`
**Body:** `{ "email": "...", "password": "..." }`
**Responses:**
- `200 OK` →
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "8f3a1c2b...",
  "expiresIn": 900
}
```
- `401 Unauthorized` → invalid credentials

#### `POST /api/auth/refresh`
**Body:** `{ "refreshToken": "8f3a1c2b..." }`
**Responses:**
- `200 OK` → new `{ accessToken, refreshToken, expiresIn }` (old refresh token rotated/invalidated)
- `401 Unauthorized` → invalid, expired, or reused refresh token (triggers full session revocation on reuse)

#### `POST /api/auth/forgot-password` / `POST /api/auth/reset-password`
Standard email-token-based reset; `200 OK` on request regardless of whether the email exists (prevents email enumeration).

---

### 5.2 URL Management

#### `POST /api/urls`
**Headers:** `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
**Body:**
```json
{
  "originalUrl": "https://github.com/Sahil-Ghorpade/social-media-platform",
  "customAlias": "portfolio",
  "expiresAt": "2026-12-31T23:59:59Z",
  "password": null,
  "tags": ["Portfolio", "GitHub"]
}
```
**Responses:**
- `201 Created` →
```json
{
  "id": 42,
  "shortUrl": "https://go.app/portfolio",
  "shortCode": "portfolio",
  "originalUrl": "https://github.com/Sahil-Ghorpade/social-media-platform",
  "status": "ACTIVE",
  "expiresAt": "2026-12-31T23:59:59Z",
  "createdAt": "2026-08-02T10:00:00Z"
}
```
- `409 Conflict` → alias already taken
- `422 Unprocessable Entity` → invalid URL, blacklisted domain, reserved alias

#### `GET /api/urls?search=&status=&tag=&sort=clicks&page=0&size=20`
**Headers:** `Authorization: Bearer <accessToken>`
**Response:** `200 OK` → paginated list:
```json
{
  "content": [ { "id": 42, "shortCode": "portfolio", "clicks": 1230, "status": "ACTIVE", "...": "..." } ],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

#### `GET /api/urls/{id}`
`200 OK` (owner only) → single URL detail; `403 Forbidden` if not owner; `404 Not Found` if it doesn't exist.

#### `PUT /api/urls/{id}`
**Body:** same shape as create (partial fields allowed). `200 OK` on success, `403`/`404`/`422` as above.

#### `DELETE /api/urls/{id}`
`204 No Content` on success; `403`/`404` as above.

---

### 5.3 Redirect (Public)

#### `GET /{shortCode}`
No auth required.
**Responses:**
- `302 Found` → `Location: <originalUrl>` header set
- `404 Not Found` → code doesn't exist, or link is `DISABLED`/`UNDER_REVIEW`
- `410 Gone` → link is `EXPIRED`
- `200 OK` (custom body) → password-prompt page if `PASSWORD_PROTECTED`
- `429 Too Many Requests` → rate limit exceeded (`Retry-After` header set)

#### `POST /{shortCode}/verify`
**Body:** `{ "password": "..." }`
**Responses:** `302 Found` (redirect proceeds) or `401 Unauthorized` (wrong password)

---

### 5.4 Analytics

#### `GET /api/urls/{id}/analytics?from=&to=&granularity=day`
**Headers:** `Authorization: Bearer <accessToken>` (owner only)
**Response:** `200 OK` →
```json
{
  "totalClicks": 1230,
  "uniqueVisitors": 812,
  "lastAccessed": "2026-08-02T09:58:00Z",
  "byCountry": [{ "country": "IN", "clicks": 640 }, { "country": "US", "clicks": 310 }],
  "byBrowser": [{ "browser": "Chrome", "clicks": 763 }],
  "byDevice": [{ "device": "desktop", "clicks": 676 }],
  "timeSeries": [{ "date": "2026-08-01", "clicks": 210 }]
}
```

---

### 5.5 QR

#### `GET /api/urls/{id}/qr`
**Headers:** `Authorization: Bearer <accessToken>` (owner only)
**Response:** `200 OK`, `Content-Type: image/png` → binary PNG stream

---

### 5.6 Admin

```
GET    /api/admin/flagged-links          → 200 OK, list of UNDER_REVIEW links
PATCH  /api/admin/links/{id}/status      → body { "status": "DISABLED" } → 200 OK
POST   /api/admin/users/{id}/ban         → 200 OK, cascades to disabling their active links
GET    /api/admin/blacklist              → 200 OK, list
POST   /api/admin/blacklist              → body { "domain": "spam.com", "reason": "..." } → 201 Created
DELETE /api/admin/blacklist/{id}         → 204 No Content
```
All admin endpoints require `Authorization: Bearer <accessToken>` with `role = ADMIN`; otherwise `403 Forbidden`.

---

## 6. Short Code Generation Strategy

1. Generate a numeric ID (DB sequence or Snowflake-style) → encode to **Base62** → produces a short, URL-safe, non-sequential-looking code.
2. For custom aliases: validate against the reserved-word list (§7 of TRD) and check uniqueness with the DB unique constraint as the final authority.
3. On collision (rare, only relevant for random-generation strategies): catch `DataIntegrityViolationException`, retry up to 3 times with a new code.

---

## 7. Security Implementation Notes

- **Password hashing (user accounts + link passwords):** bcrypt, distinct from IP hashing (SHA-256) — don't conflate the two; bcrypt is for verifiable secrets, SHA-256 is for one-way anonymization of IPs.
- **IP hashing:** `SHA-256(ip + server-side salt)` — salt kept in config/secret manager, not in code.
- **Blacklist check:** performed at link-creation time; optionally re-checked periodically for existing links.
- **Rate limiting / CAPTCHA:** see `02_TRD.md` §5.1, §6.
- **Ownership check:** every non-admin URL mutation must verify `url.user_id == authenticatedUser.id`, not just that the requester is authenticated — otherwise it's an IDOR.
