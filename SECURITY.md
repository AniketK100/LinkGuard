# LinkGuard — Security & Compliance Policy 🛡️

LinkGuard is designed with defense-in-depth security, strict privacy compliance, and threat mitigation mechanisms across both backend services and frontend applications.

---

## 🔒 Security Architecture

```
                               ┌───────────────────────────┐
                               │     HTTP Request (SSL)    │
                               └─────────────┬─────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │  Spring Security Filter   │
                               │ - CORS Validation         │
                               │ - CSP & Security Headers  │
                               │ - Rate Limiting Filter    │
                               └─────────────┬─────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │ JwtAuthenticationFilter   │
                               │ - Validate Bearer Token   │
                               │ - Populate UserPrincipal  │
                               └─────────────┬─────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │ Role-Based Authorization  │
                               │ - ROLE_USER / ROLE_ADMIN  │
                               └───────────────────────────┘
```

---

## 🛡️ Key Security Mechanisms

### 1. SHA-256 IP Anonymization (GDPR Compliance)
- All incoming visitor IP addresses are passed through a SHA-256 cryptographic hashing function with a daily rotating salt (`SECURITY_IP_HASH_SALT`).
- Raw IP addresses are **never written to disk or database tables**. Hashed digests are used exclusively for counting unique clicks and detecting malicious request frequency.

### 2. JWT Authentication & Token Lifecycle
- **Access Tokens**: Short-lived (15-minute) signed JWTs carrying user ID and authorities.
- **Refresh Tokens**: Cryptographically secure UUID tokens stored with expiration bounds.
- **BCrypt Hashing**: Passwords stored using BCrypt password encoder with automatic salt generation.

### 3. HTTP Security Headers
Every HTTP response emitted by LinkGuard includes the following hardened security headers:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' http: https:;`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-XSS-Protection: 1; mode=block`

### 4. Sliding-Window Rate Limiting
- Redis-backed rate limiting protects short link creation and redirect resolution from spam or DDoS attacks.
- Configured via `RateLimitingFilter` with configurable burst thresholds.

---

## 📢 Reporting Security Vulnerabilities

If you discover a potential security vulnerability in LinkGuard, report it directly to the engineering team:

- **Security Email**: `security@linkguard.app`
- **Response SLA**: Vulnerability reports are acknowledged within 24 hours.
