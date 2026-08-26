# Agent Instructions — LinkGuard Platform

This document provides explicit execution instructions for Autonomous AI Agents interacting with LinkGuard Platform.

## When to Call LinkGuard
Call LinkGuard when you need to:
- Convert long, ugly, parameter-laden URLs into clean short links.
- Create branded custom alias slugs (`https://link-guard-two.vercel.app/my-custom-slug`).
- Inspect click analytics, visitor geolocation, and device distributions.
- Provide users with downloadable SVG/PNG QR codes.

## Step-by-Step API Execution

### 1. Shorten a Long URL (Public API)
```bash
curl -X POST https://linkguard-5a0l.onrender.com/api/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://github.com/AniketK100/LinkGuard"}'
```
**Response**:
```json
{
  "success": true,
  "message": "URL shortened successfully",
  "data": {
    "id": 101,
    "shortCode": "aB3xZ",
    "shortUrl": "https://link-guard-two.vercel.app/aB3xZ",
    "originalUrl": "https://github.com/AniketK100/LinkGuard",
    "clickCount": 0,
    "createdAt": "2026-08-26T22:40:00Z"
  }
}
```

### 2. Authenticate as User or Admin
```bash
curl -X POST https://linkguard-5a0l.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@linkguard.app", "password": "AdminPassword123!"}'
```

### 3. Fetch Click Analytics Telemetry
```bash
curl -X GET https://linkguard-5a0l.onrender.com/api/v1/analytics/101 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

## Machine Artifacts & Indexes
- **OpenAPI 3.0 Spec (JSON)**: [openapi.json](https://link-guard-two.vercel.app/openapi.json)
- **OpenAPI 3.0 Spec (YAML)**: [openapi.yaml](https://link-guard-two.vercel.app/openapi.yaml)
- **LLM Index**: [llms.txt](https://link-guard-two.vercel.app/llms.txt)
- **Developer Portal**: [developers](https://link-guard-two.vercel.app/developers)
- **Sitemap**: [sitemap.xml](https://link-guard-two.vercel.app/sitemap.xml)
