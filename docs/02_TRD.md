# 02 — Technical Requirements Document (TRD) — v2
## URL Intelligence Platform

*Revision note: v2 adds full NFR thresholds/enforcement, an expanded security section (CSRF, CORS, JWT policy, password policy, rate limiting, brute force, SQLi, XSS, open redirect, SSRF), validation-rule tables, standardized error handling, logging strategy, and monitoring. Each major decision now includes an explicit "Why" rationale, not just the decision itself.*

---

## 1. Architecture Overview

**Style:** Modular monolith (single deployable Spring Boot app, internally organized by domain module).

**Why a modular monolith and not microservices:**
- A solo developer with a 10–14 day budget cannot absorb the operational tax of microservices — service discovery, distributed tracing, network failure handling, multiple deployment pipelines — without the timeline collapsing.
- A modular monolith still enforces domain boundaries (package-by-feature, no cross-module repository access) so that if the product *does* need to scale organizationally later, individual modules (e.g., `analytics`, `redirect`) can be extracted into services without a full rewrite.
- Given the traffic profile of a URL shortener (extremely read-heavy on one endpoint — the redirect), the actual scaling bottleneck is the redirect path and the database, not process boundaries. Redis + read replicas solve that more cheaply than microservices would.

```
                React Dashboard (SPA)
                        │
                        ▼
              Spring Boot REST API
   ┌───────────┬───────────┬────────────┬──────────────┬───────────────┬─────────────┐
   │   Auth    │    URL    │  Redirect  │  Analytics   │   Security    │  QR / Admin │
   │  Module   │  Service  │  Service   │   Service     │    Module     │   Module    │
   └───────────┴───────────┴────────────┴──────────────┴───────────────┴─────────────┘
                        │                                        │
                        ▼                                        ▼
                  PostgreSQL                                   Redis
           (system of record: users,                 (cache-aside for redirects,
            urls, click_events,                        rate-limit counters,
            blacklist, api_keys)                        session/token blacklist)
```

---

## 2. Technology Stack

### Backend
- **Java 21**, **Spring Boot 3**
- Spring Security (JWT-based, stateless)
- Spring Data JPA + Hibernate
- MapStruct (DTO ↔ entity mapping)
- Lombok (boilerplate reduction)
- Bean Validation (`jakarta.validation`) for request DTOs
- Flyway (versioned DB migrations)

### Data Layer
- **PostgreSQL** — primary relational store
- **Redis** — cache-aside for redirects, rate-limit counters, optional token blacklist (stretch)

### Frontend
- **React** + **Vite**, **Tailwind CSS**, **React Router**, **TanStack Query**, **Axios**, **Chart.js**/**Recharts**

### Testing
- JUnit 5, Mockito, Testcontainers (optional), Spring Boot Test

### Documentation
- OpenAPI/Swagger (springdoc-openapi)

### DevOps
- Docker + Docker Compose, GitHub Actions, Render/Railway/Fly.io

---

## 3. Non-Functional Requirements (Full Technical Detail)

| Category | Requirement | Threshold | Enforcement / Measurement |
|---|---|---|---|
| **Performance** | Redirect latency | p95 < 100ms (cache hit), < 300ms (DB-only) | Load test with k6/Apache Bench; measured via Actuator timers |
| **Availability** | Uptime target | 99% (MVP, single instance) | Health checks (`/actuator/health`); documented, not SLA-enforced in v1 |
| **Scalability** | Data volume | 100,000+ URLs, `click_events` growing indefinitely | Indexing strategy (§ in `05_Backend_Schema_Data_Auth.md`) + partitioning plan for `click_events` |
| **Concurrency** | Simultaneous users | 500 concurrent without redesign | Stateless auth (no sticky sessions) + connection pooling (HikariCP) sized appropriately |
| **Security** | Auth & data protection | JWT + bcrypt + IP hashing; no PII stored in plaintext | See §5 (Security Deep Dive) |
| **Consistency** | Redirect must never fail due to analytics | 100% isolation | Analytics writes wrapped in `@Async` + independent transaction (`REQUIRES_NEW`) |
| **Cache resilience** | Redis outage must not break redirects | Fail-open | Redirect service catches Redis exceptions and falls back to DB read |
| **Observability** | Every request traceable | 100% of requests have a correlation/request ID | MDC-based logging filter (§7) |
| **Testability** | Confidence before merge | ≥70% service-layer coverage | JaCoCo report in CI |

---

## 4. Key Technical Decisions & Rationale

| Decision | Rationale ("Why") |
|---|---|
| Base62 short codes over raw UUID | UUIDs are 36 characters and not visually clean in a shareable URL. Base62-encoding a sequential/Snowflake ID produces a 6–8 character code with a keyspace of 62^7 ≈ 3.5 trillion — enormous headroom with a URL-friendly alphabet (no `-`, no ambiguous characters if curated). |
| Collision handling via DB unique constraint + retry | A distributed lock (e.g., Redis `SETNX`) would add complexity for a problem that's already vanishingly rare with a large keyspace. Catching `DataIntegrityViolationException` and retrying (max 3 attempts) is simpler and correct. |
| 302 (Found), not 301 (Moved Permanently), for redirects | Links can expire, be disabled, or change status. A 301 is aggressively cached by browsers/CDNs and would make the platform's own expiry/disable features unreliable from the client's perspective. |
| JWT + refresh token over server-side sessions | Stateless tokens mean the API can scale horizontally without sticky sessions or a shared session store. The refresh token allows the access token to stay short-lived (limiting the blast radius of a stolen token) while avoiding constant re-logins. |
| IP hashing (SHA-256 + salt), never raw IP | Enables unique-visitor counting (same hash = same visitor) without storing personally identifiable information — reduces privacy/compliance exposure and blast radius if the DB is ever breached. |
| Redis cache-aside (not write-through) for redirects | The redirect path is overwhelmingly read-heavy. Cache-aside is simpler to reason about, and — critically — degrades gracefully: if Redis is down, the app falls back to Postgres instead of failing outright (write-through patterns are harder to make fail-open safely). |
| Click events written asynchronously (`@Async`, future queue-ready) | The user-facing redirect must not wait on an analytics write. Isolating it in a separate thread/transaction means a slow or failing analytics write never delays or breaks the 302 response. Structuring it as a queue-shaped abstraction now means swapping in Kafka/RabbitMQ later is a plug-in, not a rewrite. |
| Modular monolith, package-by-feature | See §1 rationale. |

---

## 5. Security Deep Dive

*This section directly answers "how do you defend this system," which is the natural line of questioning once the architecture is presented.*

### 5.1 Authentication & Session Security
- **JWT expiration:** access token 15 minutes; refresh token 7–30 days, rotated on every use.
- **Refresh token reuse detection:** if a previously-used (rotated-out) refresh token is presented again, treat as a compromise signal and revoke all sessions for that user.
- **Refresh tokens stored hashed** (never plaintext) in a `refresh_tokens` table, so a DB leak doesn't hand out usable tokens.
- **Password policy:** minimum 8 characters, at least one letter and one number (documented, tunable); bcrypt cost factor ≥ 10.
- **Brute-force protection:** failed login attempts counted per email+IP in Redis; after N failures (e.g., 5) within a window, require CAPTCHA or apply exponential backoff before allowing further attempts.

### 5.2 CORS
- Explicit allow-list of the frontend origin(s) only — never `*` in combination with credentials.
- Only required methods/headers permitted; preflight cached with a sane `max-age`.

### 5.3 CSRF
- Because auth uses **stateless Bearer tokens in the Authorization header** (not cookies) for the primary API, classic CSRF (which exploits ambient cookie auth) is largely mitigated for the JSON API.
- If refresh tokens are ever stored in an httpOnly cookie (recommended for XSS resistance), CSRF protection (SameSite=Strict/Lax + CSRF token on state-changing requests) must be added for that specific flow.

### 5.4 XSS
- React escapes output by default — avoid `dangerouslySetInnerHTML` entirely, especially for user-supplied link titles/descriptions pulled from link-preview scraping.
- Backend sanitizes/validates any user-supplied text (tags, custom aliases) against an allow-list pattern before storage or display.

### 5.5 SQL Injection
- Spring Data JPA/Hibernate parameterized queries by default — no string-concatenated JPQL/native queries. Any native query must use bind parameters, never string interpolation.

### 5.6 Open Redirect
- The platform's core function *is* redirection, which is itself a classic open-redirect vector if abused (e.g., someone shortens a link to a phishing site and distributes the trusted short domain).
- Mitigations: blacklist check at creation time, optional Safe-Browsing-style check, admin ability to disable/flag, and clear terms that a short link is not an endorsement of the destination.
- The redirect target is always the *stored* `original_url` looked up server-side by short code — never a URL parameter the client controls at redirect time — which prevents classic parameter-based open-redirect (`?redirect=evil.com`).

### 5.7 SSRF
- Any server-side fetch of the destination URL (e.g., for link-preview scraping — title/OG image) must not be allowed to hit internal/private IP ranges (`127.0.0.1`, `169.254.169.254` metadata endpoints, RFC1918 ranges). Validate/resolve the hostname and reject private/loopback/link-local targets before fetching.
- Set a strict timeout and response-size cap on any outbound preview-fetch request.

### 5.8 Rate Limiting & Abuse
- Redis-backed counters, per-IP for the public redirect endpoint and per-user for authenticated write endpoints.
- Algorithm progression (documented for discussion depth): **Fixed Window → Sliding Window → Token Bucket** (see §6).
- Abuse patterns (excessive clicks/IP, redirect loops) mark a link `UNDER_REVIEW` rather than auto-disabling — avoids false-positive lockouts while surfacing risk to admins.

---

## 6. Rate Limiting Design (Algorithm Detail)

| Algorithm | How it works | Trade-off |
|---|---|---|
| Fixed Window | `INCR` a Redis counter keyed by `ip:minuteBucket`, `EXPIRE` at window boundary | Simple, but allows bursts at window edges (2x limit possible at boundary) |
| Sliding Window | Sorted set of timestamps per key; count entries within the trailing window | More accurate, slightly more Redis overhead |
| Token Bucket | Bucket refills at a fixed rate; each request consumes a token; implemented atomically via Lua script | Smooths bursts, industry-standard choice; most defensible in an interview |

**Recommendation for v1:** implement Fixed Window first (fast to ship), document Sliding Window/Token Bucket as the natural evolution — this progression itself is a strong interview narrative ("I started simple, identified the boundary-burst flaw, and evolved to token bucket").

Response on limit breach: `429 Too Many Requests` with a `Retry-After` header.

---

## 7. Validation Rules

*Every user-supplied field needs an explicit, testable rule — not just "validate the URL."*

| Field | Rule |
|---|---|
| `originalUrl` | Required; must be a well-formed `http://` or `https://` URL; max 2048 characters; reject `javascript:`/`data:` schemes; reject `localhost`/private IP targets (SSRF guard) |
| `customAlias` | Optional; 3–30 characters; alphanumeric + hyphen only; case-insensitive uniqueness check; reject reserved words (`admin`, `api`, `login`, `register`, `static`, etc.) |
| `password` (link) | Optional; if provided, 4–64 characters; bcrypt-hashed, never logged |
| `expiresAt` | Optional; must be a future timestamp; max horizon configurable (e.g., 1 year) to bound long-lived unused rows |
| `email` (user) | Required; RFC 5322-compliant format; max 255 characters; uniqueness enforced at DB level |
| `password` (user) | Required; min 8 characters, ≥1 letter, ≥1 number; rejected against a common-password blocklist (stretch) |
| `tags` | Optional; max 5 per link; each tag 1–20 characters, alphanumeric + space |

---

## 8. Standardized Error Handling

*All errors flow through a single `@ControllerAdvice` and return the shape defined in `05_Backend_Schema_Data_Auth.md` §4. Status codes are used deliberately, not defaulted to 400/500.*

| Code | Meaning | Example Scenario |
|---|---|---|
| 400 | Bad Request | Malformed JSON body |
| 401 | Unauthorized | Missing/invalid/expired access token; wrong link password |
| 403 | Forbidden | Authenticated but not the resource owner; non-admin hitting `/admin/**` |
| 404 | Not Found | Short code doesn't exist; disabled link (deliberately indistinguishable from non-existent) |
| 409 | Conflict | Email already registered; custom alias already taken |
| 410 | Gone | Link past its `expiresAt` |
| 422 | Unprocessable Entity | Validation failure (bad URL format, blacklisted domain, weak password) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled exception — logged with correlation ID, generic message returned to client |

---

## 9. Logging Strategy

- **Levels:**
  - `ERROR` — unhandled exceptions, failed analytics writes, Redis connection failures (fail-open path taken)
  - `WARN` — rate-limit breaches, blacklist rejections, failed login attempts, expired-token usage
  - `INFO` — successful auth events (login/register), link creation/deletion, admin actions
  - `TRACE`/`DEBUG` — request/response bodies in local/dev only, never in production (avoid logging secrets, passwords, tokens, or raw IPs)
- **Structured (JSON) logs** in production, tagged with a **correlation/request ID** (generated per request via a servlet filter, propagated into the MDC) so a redirect request can be traced through to its async analytics write.
- **Never log:** raw passwords, JWT secrets, raw IP addresses (log the hash if needed for debugging), refresh tokens.

---

## 10. Monitoring

- **Spring Boot Actuator** enabled for `/actuator/health`, `/actuator/metrics`, `/actuator/info`.
- **Key metrics to track:** redirect request rate, redirect latency percentiles, cache hit/miss ratio, rate-limit rejection count, async analytics queue lag/failure count, JVM memory/GC (baseline health).
- **Health checks:** DB connectivity, Redis connectivity (reported but not fatal — redirect fails open without Redis).
- Even a minimal v1 should expose these; a professional design doc doesn't treat monitoring as an afterthought bolted on post-launch.

---

## 11. Deployment Overview

*Full day-by-day deployment execution lives in `06_Implementation_Plan_Build_Order.md` §5; this section defines the technical shape.*

- **Docker:** multi-stage Dockerfile — build stage (Maven/Gradle) produces the jar, final stage runs on a slim JRE image.
- **Docker Compose (local):** `app`, `postgres`, `redis` services; `.env` file for local secrets, never committed.
- **Environment variables:** `DB_URL`, `DB_USER`, `DB_PASSWORD`, `REDIS_URL`, `JWT_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`, `IP_HASH_SALT` — all externalized, none hardcoded.
- **CI (GitHub Actions):** run tests + build on every push/PR; optionally build and push a versioned Docker image.
- **CD:** deploy to Render/Railway/Fly.io with managed Postgres + Redis add-ons; secrets set via the platform's secret manager.
- **Production checklist:** see `06_Implementation_Plan_Build_Order.md` §5 for the full pre-launch checklist.

---

## 12. Non-Functional Edge Cases to Design For

- Short code requested twice concurrently (custom alias race) → unique DB constraint is the source of truth; optimistic retry on `DataIntegrityViolationException`.
- Redis unavailable → redirect service fails open to DB lookup, never fails the request.
- Expired/disabled link hit → `410` (expired) or `404` (disabled/not found); never leak whether a code "used to exist" beyond what's necessary.
- Password-protected link → redirect flow forks to a password-prompt response instead of a 302 until verified.
- Analytics write failure → must never fail/roll back the user's redirect (isolated via `@Async` + `REQUIRES_NEW` transaction).
