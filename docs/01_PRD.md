# 01 — Product Requirements Document (PRD) — v2
## URL Intelligence Platform

*Revision note: v2 addresses gaps identified in review — adds a formal Functional Requirements table (priority/release), a Non-Functional Requirements summary, and proper user stories with acceptance criteria. Full NFR technical detail lives in `02_TRD.md`.*

---

## 1. Product Summary

**Name:** URL Intelligence Platform
**Category:** Backend-heavy SaaS utility (Bitly + VirusTotal Lite + Analytics)
**Elevator Pitch:** A production-inspired URL management platform that lets users create secure, trackable short links with real-time analytics, security controls, QR generation, and abuse detection — designed to demonstrate senior-level backend engineering, not just CRUD.

**Why this matters (design rationale):** Portfolio URL shorteners are common and unremarkable. This product differentiates itself by treating a link as a stateful, intelligent object — with a security posture, a lifecycle, and an analytics profile — which forces (and demonstrates) real architectural decisions: caching strategy, async processing, rate limiting, abuse handling.

---

## 2. Problem Statement

Freelancers, recruiters, marketers, and developers share links constantly but have no visibility into who clicked, when, from where, on what device, or whether a link is being abused. A shortened, trackable link (`go.app/dev` instead of a long portfolio URL) turns a static string into a measurable, controllable asset.

---

## 3. Target Users

| Segment | Use Case |
|---|---|
| Students / Job seekers | Resume, portfolio, GitHub links with click tracking |
| Companies / Marketers | Campaign links, conversion tracking |
| Recruiters | Share/track access to interview documents |
| Content creators | YouTube/Instagram/LinkedIn/Twitter bio links |
| Developers | Temporary download links, API/doc sharing |

---

## 4. Functional Requirements

*Every feature is scored by priority (High/Medium/Low) and mapped to the release it ships in (MVP / v1-advanced / v2+). This replaces a purely descriptive feature list with something scannable in seconds.*

| Feature | Priority | Release | Notes |
|---|---|---|---|
| Register | High | MVP | Email + password, bcrypt hashed |
| Login | High | MVP | Issues access + refresh JWT |
| Refresh token flow | High | MVP | Rotation + reuse detection |
| Email verification | Low | MVP (optional) | Can ship post-MVP without blocking |
| Forgot / reset password | Medium | MVP | |
| Create short URL | High | MVP | Base62 or custom alias |
| Custom alias | High | MVP | Uniqueness + reserved-word check |
| Update / delete link | High | MVP | Owner-only |
| Public redirect endpoint | High | MVP | Core hot path |
| Basic analytics (clicks, unique visitors, last accessed, referrer, browser, OS, device) | High | MVP | |
| Dashboard (list, totals, most popular, recent activity) | High | MVP | |
| Password-protected links | High | v1-advanced | Security differentiator |
| Link expiration | High | v1-advanced | Scheduled job to flip status |
| Rate limiting | High | v1-advanced | Redis-backed counters |
| Blacklisted domains | Medium | v1-advanced | Checked at creation time |
| CAPTCHA after suspicious activity | Low | v1-advanced | Stretch within advanced set |
| Safe Browsing–style checks | Low | v1-advanced | Can be stubbed if no API budget |
| Expanded analytics (country, city, hourly/daily traffic, charts) | High | v1-advanced | |
| QR code generation | Medium | v1-advanced | Auto-generated per link |
| Link preview (title/description/favicon/OG image) | Medium | v1-advanced | |
| Search / filter / sort / pagination | High | v1-advanced | Table usability |
| Favorites (pin links) | Low | v1-advanced | |
| Tags | Medium | v1-advanced | |
| Redis cache-aside for redirects | High | Stretch / v2 | Performance |
| Async analytics (`@Async` → queue) | High | Stretch / v2 | Keeps redirect hot path unblocked |
| Rate limiter algorithm depth (fixed/sliding/token bucket) | Medium | Stretch / v2 | Interview talking point |
| Abuse detection (flag, don't auto-block) | Medium | Stretch / v2 | |
| Admin panel | Medium | v1-advanced | Disable links, ban users, manage blacklist |
| Custom domains | Low | v3 | Out of scope for v1 |
| Multi-tenant orgs | Low | v3 | Out of scope for v1 |
| Kafka/RabbitMQ event pipeline | Low | v3 | Out of scope for v1 |
| AI phishing/anomaly detection | Low | v4 | Out of scope for v1 |

---

## 5. Non-Functional Requirements (Summary)

*Full technical detail — thresholds, measurement method, enforcement mechanism — lives in `02_TRD.md` §3. This is the product-level summary.*

| Category | Target | Why it matters |
|---|---|---|
| **Performance** | Redirect p95 < 100ms (cache hit), < 300ms (DB only) | Redirect is the highest-traffic, most latency-sensitive path in the product |
| **Availability** | 99% (single-instance MVP; design allows horizontal scaling later) | Realistic for a solo-built v1, but architecture shouldn't block scaling |
| **Security** | JWT stateless auth, bcrypt password hashing, IP hashing, no PII in analytics | Users trust the platform with links that may be sensitive (interview docs, campaigns) |
| **Scalability** | Support 100k+ URLs and 500 concurrent users without redesign | Sets a concrete bar for schema/index/cache decisions |
| **Concurrency** | Handle simultaneous writes to the same short code (custom alias race) safely | Prevents duplicate/broken links under load |
| **Data integrity** | No analytics write failure may affect the user's redirect | Redirect is the product's core promise; analytics is secondary |
| **Maintainability** | Modular monolith, package-by-feature | Solo developer, 10–14 day build, but should remain extensible |

---

## 6. User Stories & Acceptance Criteria

*Each story follows the standard "As a / I want / so that" format with explicit acceptance criteria.*

### US-1: Account Registration
**As a** new user, **I want** to register with email and password, **so that** I can create and manage my own short links.
**Acceptance Criteria:**
- Given a valid, unused email and a password meeting the password policy (`02_TRD.md` §6), the account is created and the password is bcrypt-hashed.
- Given an email already in use, the API returns `409 Conflict`.
- Given an invalid email format or weak password, the API returns `422 Unprocessable Entity` with field-level errors.

### US-2: Login & Session
**As a** registered user, **I want** to log in and stay authenticated across requests, **so that** I don't have to re-enter credentials constantly.
**Acceptance Criteria:**
- Valid credentials return an access token (15 min) and refresh token (7–30 days).
- Invalid credentials return `401 Unauthorized` without revealing whether the email or password was wrong.
- An expired access token triggers a silent refresh via `/refresh`; if the refresh token is also invalid, the user is logged out.

### US-3: Create Short Link
**As a** logged-in user, **I want** to shorten a URL with an optional custom alias, **so that** I can share a clean, trackable link.
**Acceptance Criteria:**
- Given a valid URL and no alias, a Base62 short code is generated and guaranteed unique.
- Given a custom alias, the system checks uniqueness and rejects reserved words (`admin`, `api`, `login`, etc.) with `409 Conflict`.
- Given a URL on the blacklist, creation is rejected with `422` and a clear reason.

### US-4: Visitor Redirect
**As a** visitor, **I want** clicking a short link to redirect me quickly to the original URL, **so that** the experience feels seamless.
**Acceptance Criteria:**
- Active link → `302 Found` redirect within the latency targets in §5.
- Expired link → `410 Gone` with a friendly page.
- Disabled / under-review link → `404 Not Found`.
- Password-protected link → password prompt page instead of immediate redirect.

### US-5: View Analytics
**As a** user, **I want** to see who clicked my link and from where, **so that** I can understand my audience.
**Acceptance Criteria:**
- Dashboard shows total clicks, unique visitors (by hashed IP), last accessed time.
- Detail page shows breakdowns by country, browser, OS, device, and a time-series chart.
- No raw IP address is ever exposed in the UI or API response — only hashed values are stored, and even those aren't surfaced to end users (aggregate stats only).

### US-6: Protect a Sensitive Link
**As a** user sharing a sensitive document (e.g., interview materials), **I want** to password-protect the link and set an expiry, **so that** access is controlled and time-boxed.
**Acceptance Criteria:**
- Correct password → redirect proceeds.
- Incorrect password → `401`, and repeated failures count toward rate-limiting/CAPTCHA triggers.
- Past the expiry date, the link returns `410 Gone` regardless of password correctness.

### US-7: Admin Moderation
**As an** admin, **I want** to review flagged links and ban abusive users, **so that** the platform isn't used maliciously.
**Acceptance Criteria:**
- Flagged (`UNDER_REVIEW`) links are listed separately from active links.
- Disabling a link or banning a user is auditable (recorded with timestamp/actor, even if just logged for v1).

---

## 7. Success Metrics

| Metric | Target |
|---|---|
| Redirect latency (p95) | < 100ms (cache hit), < 300ms (DB only) |
| MVP completion | Within 7 days |
| Full v1 (MVP + advanced) | Within 14 days |
| Test coverage (service layer) | ≥ 70% |
| Concurrent users supported | 500 without redesign |
| URLs supported without redesign | 100,000+ |

---

## 8. Roadmap Beyond v1

| Version | Additions |
|---|---|
| v2 | Redis caching, async analytics via `@Async`, advanced dashboards |
| v3 | Kafka/RabbitMQ event-driven click processing, Elasticsearch search, cloud object storage, multi-tenant organizations, custom domains |
| v4 | AI-powered phishing/anomaly detection, predictive click analytics |

---

## 9. Assumptions & Constraints

- Single developer, 10–14 day timeline, part-time-feasible
- Modular monolith architecture (not microservices) — explicit scope-control decision, revisited with rationale in `02_TRD.md`
- PostgreSQL as system of record; Redis as cache/rate-limit store (introduced in stretch phase)
- No paid third-party services required for MVP (Safe Browsing check can be stubbed if API cost/key is a blocker)
