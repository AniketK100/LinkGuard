# 06 — Implementation Plan & Build Order — v2
## URL Intelligence Platform — End-to-End Engineering Roadmap

*Revision note: v2 breaks the roadmap down to a **daily** level (not just phases), deepens the testing strategy (unit/repository/controller/security/integration/manual with coverage goals), and adds a full production deployment checklist. Each phase retains "why" rationale so the plan reads as reasoned decisions, not a checklist.*

---

## 1. Technology Stack (Recap)

| Layer | Stack |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, MapStruct, Lombok, Flyway |
| Database | PostgreSQL (system of record), Redis (cache/rate-limit) |
| Frontend | React, Vite, Tailwind CSS, React Router, TanStack Query, Axios, Chart.js/Recharts |
| Testing | JUnit 5, Mockito, Testcontainers (optional), Spring Boot Test, JaCoCo |
| Docs | OpenAPI/Swagger |
| DevOps | Docker, Docker Compose, GitHub Actions, Render/Railway/Fly.io |

---

## 2. Backend Folder Structure

```
src/main/java/com/app/urlintel
├── auth/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── security/         # JwtAuthenticationFilter, JwtTokenProvider, SecurityConfig
├── url/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── validator/
├── redirect/
│   ├── controller/
│   └── service/
├── analytics/
│   ├── controller/
│   ├── service/
│   └── repository/
├── security/              # rate limiting, blacklist, abuse detection
│   ├── ratelimit/
│   └── blacklist/
├── qr/
│   └── service/
├── admin/
│   ├── controller/
│   └── service/
├── cache/                 # Redis abstraction (RedisTemplate wrapper)
├── common/
│   ├── exception/          # GlobalExceptionHandler, custom exceptions
│   ├── config/              # SecurityConfig, RedisConfig, OpenApiConfig
│   ├── dto/
│   ├── mapper/               # MapStruct interfaces
│   └── util/                  # Base62 encoder, IP hasher, UA parser
└── UrlIntelApplication.java
```

Frontend structure is specified in `04_UIUX_Design_Brief.md` §7.

---

## 3. Daily Build Plan (14 Days)

*Why daily granularity: phase-level plans ("Days 1-2: Foundation") are easy to underestimate. A daily plan forces each day to end with a demonstrable milestone, which is what keeps a solo 10-14 day build on track.*

| Day | Focus | Deliverable / Milestone |
|---|---|---|
| **1** | Project setup | Spring Initializr project (Web, Security, JPA, PostgreSQL, Validation, Lombok); Docker Compose (app + Postgres + Redis); Flyway baseline migration; package skeleton per §2; `/actuator/health` returns 200 |
| **2** | Authentication | `users` entity + Flyway migration; register/login endpoints; bcrypt hashing; JWT provider (access + refresh); `JwtAuthenticationFilter`; stateless `SecurityConfig`. **Milestone:** register → login → call a protected `/me` endpoint with Bearer token |
| **3** | URL module (create) | `urls` entity + migration; Base62 short-code generator + collision retry; `POST /urls` with full validation (TRD §7); custom alias + reserved-word check. **Milestone:** create a link via Postman, row appears in DB with correct constraints |
| **4** | Redirect + URL CRUD | `GET /{shortCode}` (DB-only, no cache yet); status checks (active/expired/disabled skeleton); `GET/PUT/DELETE /urls/{id}` with ownership checks. **Milestone:** create a link via API, hit the short URL in a browser, get redirected |
| **5** | Analytics — capture | `click_events` entity + migration; UA parsing (browser/OS/device); IP hashing (SHA-256 + salt); async click-event write (`@Async`, `REQUIRES_NEW`) wired into the redirect flow. **Milestone:** clicking a link writes a normalized row without slowing the redirect response |
| **6** | Analytics — dashboard | `GET /urls/{id}/analytics` aggregation queries (totals, unique visitors, breakdowns, time series); dashboard summary endpoint. **Milestone:** simulate clicks from a few different UAs/IPs, dashboard reflects accurate counts |
| **7** | Security — expiry & password | `expires_at` check in redirect flow; `@Scheduled` job to flip `EXPIRED` status; password-protected links (`password_hash` on `urls`, `POST /{shortCode}/verify`). **Milestone:** expired and password-protected links behave per the flows in `03_App_Flow.md` §4–5 |
| **8** | Security — blacklist & rate limiting | Blacklist check at creation time; Redis-backed Fixed Window rate limiter on redirect + auth endpoints; brute-force lockout on login. **Milestone:** exceeding the limit returns 429 with `Retry-After`; blacklisted domain rejected at creation |
| **9** | Performance — Redis cache | Cache-aside for `GET /{shortCode}` (cache miss → DB → populate cache); invalidation on update/delete/disable; fail-open behavior if Redis is down. **Milestone:** benchmark (k6/AB) redirect latency before/after cache, document p95 improvement |
| **10** | Testing — backend | Unit tests (services), repository tests (`@DataJpaTest`), controller tests (`@WebMvcTest` + MockMvc), security tests (auth filter, ownership checks). **Milestone:** JaCoCo report ≥70% on service layer |
| **11** | Testing — integration + docs | Integration tests (full auth + redirect flow, Testcontainers if used); OpenAPI/Swagger finalized for all endpoints. **Milestone:** `mvn test` green in CI locally; Swagger UI browsable and matches `05_Backend_Schema_Data_Auth.md` §5 |
| **12** | Docker, CI/CD | Multi-stage Dockerfile; finalize `docker-compose.yml`; GitHub Actions workflow (build → test → optional image push). **Milestone:** CI pipeline green on a fresh clone; Docker image builds and runs standalone |
| **13** | Stretch — QR + abuse detection | QR generation endpoint + frontend display/download; abuse-detection flagging (`UNDER_REVIEW`, not auto-block); admin endpoints (flagged links, ban user, manage blacklist). **Milestone:** at least QR + one abuse-detection trigger demoable |
| **14** | Deployment + final polish | Deploy to Render/Railway/Fly.io; run production checklist (§6); manual end-to-end test pass on the deployed instance; README + demo script. **Milestone:** live URL, all core flows verified in production |

### Frontend Track (parallel, starting Day 3)

| Days | Focus |
|---|---|
| 3–4 | Auth pages (Login/Register), Axios instance + refresh interceptor, `AuthContext` |
| 5–6 | Links List + Create/Edit modal, Dashboard shell + summary cards (per wireframes in `04_UIUX_Design_Brief.md`) |
| 7–8 | Link Detail page with charts, password prompt page, expired/disabled public pages |
| 9–11 | Polish: loading/empty/error states (mapped to error codes in TRD §8), responsive pass |
| 12–14 | QR display, Admin panel UI, final visual QA against the wireframes |

---

## 4. Testing Strategy (Depth)

*Why layered testing matters: each layer catches a different class of bug — unit tests catch logic errors cheaply and fast; integration tests catch wiring/config errors that unit tests can't see; security tests specifically catch authorization bugs (IDOR, missing ownership checks) that are otherwise easy to ship silently.*

| Layer | Tooling | Focus | Example |
|---|---|---|---|
| **Unit** | JUnit 5 + Mockito | Service logic in isolation, mocked repositories | Base62 encoder produces unique, valid codes; JWT provider generates/validates tokens correctly; expiry-check logic |
| **Repository** | `@DataJpaTest` | Query correctness, constraints | Unique constraint on `short_code` throws on duplicate; cascade delete removes `click_events` when a `url` is deleted |
| **Controller** | `@WebMvcTest` + MockMvc | Request/response shape, status codes, validation | `POST /urls` with malformed URL returns `422` with field errors; missing auth header returns `401` |
| **Security** | Spring Security Test | AuthN/AuthZ correctness | Non-owner cannot `PUT /urls/{id}` of another user's link (`403`, not `404` — verify it's not leaking existence either way per design choice); non-admin blocked from `/admin/**` |
| **Integration** | `@SpringBootTest` (+ Testcontainers, optional) | Full flow against real Postgres/Redis | End-to-end: register → login → create link → redirect → click recorded → analytics reflects it |
| **Manual / exploratory** | Postman collection, browser | Password-protected flow, expired-link UX, rate-limit behavior under rapid manual requests | Sanity-check things automated tests are clumsy at covering (visual states, actual browser redirect behavior) |

**Coverage goal:** ≥70% on `service` packages (JaCoCo, enforced/reported in CI). Don't chase 100% on DTOs/mappers/config — diminishing returns there.

---

## 5. Deployment Plan

1. **Containerize:** multi-stage Dockerfile — build stage (Maven/Gradle) produces the jar, final stage runs on a slim JRE image.
2. **Local parity:** `docker-compose.yml` with `app`, `postgres`, `redis` services, `.env` for secrets (never committed — `.env.example` committed instead).
3. **CI (GitHub Actions):** on push/PR → run tests → build image → (optional) push to registry.
4. **CD:** deploy to Render/Railway/Fly.io — provision managed Postgres + Redis add-ons, set env vars (JWT secret, DB URL, Redis URL, IP hash salt) via the platform's secret manager.
5. **Post-deploy smoke test:** health check endpoint, register/login, create a link, hit redirect, verify analytics records a click.

### 5.1 Production Checklist

- [ ] All secrets (`JWT_SECRET`, `IP_HASH_SALT`, DB/Redis credentials) set via platform secret manager, none hardcoded or in a committed `.env`
- [ ] Flyway migrations applied cleanly on a fresh database
- [ ] CORS allow-list restricted to the actual production frontend origin (no wildcard)
- [ ] Rate limiting active on redirect and auth endpoints
- [ ] `/actuator/health` and `/actuator/metrics` reachable (internally, not publicly exposed without auth)
- [ ] Structured JSON logging enabled, correlation ID filter active
- [ ] HTTPS enforced (platform-level or via reverse proxy)
- [ ] Database backups enabled (managed Postgres add-on setting)
- [ ] Redis configured with an eviction policy appropriate for a cache (e.g., `allkeys-lru`) so it can't grow unbounded
- [ ] Swagger/OpenAPI UI either disabled in production or protected, per team preference
- [ ] Smoke test suite run against the live deployment before sharing the link

---

## 6. Maintenance & Operations

- **Logging:** structured JSON logs (correlation/request ID per request) for traceability across redirect → async analytics write (full levels/rules in `02_TRD.md` §9).
- **Monitoring:** Spring Boot Actuator — track cache hit ratio, redirect latency, error rates (full detail in `02_TRD.md` §10).
- **Data lifecycle:** plan for partitioning/archiving `click_events` once it grows large (see `05_Backend_Schema_Data_Auth.md` §2 scaling note).
- **Secret rotation:** JWT signing secret and IP-hash salt should be rotatable without code changes (env-config driven).
- **Dependency hygiene:** keep Spring Boot/React dependencies patched; Dependabot or Renovate recommended.

---

## 7. Best Practices Checklist

- [ ] Package-by-feature, not package-by-layer, for easier future microservice extraction
- [ ] All write endpoints validate DTOs with Bean Validation; never trust client input
- [ ] Ownership checks on every non-admin mutation (prevent IDOR)
- [ ] Passwords: bcrypt for secrets, SHA-256+salt for IP anonymization — never conflate the two
- [ ] Redirect hot path never blocked by analytics writes (async, isolated transaction)
- [ ] Cache failures fail open (never break the redirect because Redis is down)
- [ ] Standardized error response shape across all endpoints
- [ ] OpenAPI docs kept in sync with actual endpoints (generate from code, don't hand-write separately)
- [ ] CI must pass before merge (tests + build)
- [ ] No secrets committed to source control; `.env`/secret manager only

---

## 8. Engineering-Concept Map (Feature → Interview Talking Point → "Why" Rationale)

*This table is the single most interview-relevant artifact in the whole doc set — it forces every feature to answer "why," not just "what."*

| Feature | Concept Demonstrated | Why (one-line rationale) |
|---|---|---|
| Short code generation | Encoding (Base62), uniqueness, collision handling | Shorter/cleaner than UUID; DB constraint + retry is simpler than distributed locking for a rare-collision problem |
| Redirect service | HTTP status semantics (302 vs 301), low-latency API design | 302 avoids browser-side permanent caching, which would break expiry/disable features |
| Redis cache | Cache-aside pattern, TTL, invalidation, fail-open design | Redirect is read-heavy; cache-aside degrades gracefully if Redis is unavailable |
| Analytics | Async event ingestion, aggregation, indexing strategy | Redirect must never be slowed or broken by analytics writes |
| Password-protected links | Hashing vs encryption, secure verification | bcrypt for verifiable secrets; distinct from the SHA-256 IP-hashing use case |
| JWT auth | Stateless auth, refresh-token rotation, reuse detection | Enables horizontal scaling without sticky sessions; reuse detection catches token theft |
| Rate limiting | Fixed window vs sliding window vs token bucket | Progression from simple to more accurate is itself a strong interview narrative |
| Expiring links | Scheduled jobs, status lifecycle | Keeps stale/sensitive links from remaining live indefinitely |
| QR generation | Binary content handling / file streaming | Demonstrates non-JSON response handling |
| Dashboard | Data aggregation & visualization | Turns raw events into decision-useful information |
| Testing | Unit vs integration vs security testing | Each layer catches a different class of bug, especially authorization bugs |
| Docker/CI | Environment parity, containerization, automated pipelines | Removes "works on my machine," enforces tests before merge |
| Open redirect / SSRF mitigations | Defensive design against the platform's own core function being abused | A URL shortener is inherently a redirect vector; must be designed defensively from day one, not patched later |

---

## 9. Beyond v1

| Version | Scope |
|---|---|
| v2 | Redis caching (if not fully done in v1), async analytics hardening, richer dashboards |
| v3 | Kafka/RabbitMQ event-driven click processing, Elasticsearch search, cloud object storage, multi-tenant orgs, custom domains |
| v4 | AI-based phishing/anomaly detection, predictive click analytics |

This roadmap keeps the MVP (Days 1–6) achievable within a week, delivers a resume-worthy, professionally-documented v1 by Day 14, and leaves a clear, well-reasoned path for future iterations.
