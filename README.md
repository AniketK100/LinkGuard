# LinkGuard 🛡️

**Intelligent URL Management & Real-Time Analytics Platform**

LinkGuard is an enterprise-grade, modular monolith web platform for short link creation, password-protected redirects, QR code customization, privacy-compliant traffic telemetry, and administrative security threat monitoring.

---

## 🚀 Key Features

- **High-Performance Redirect Engine**: Sub-millisecond URL resolution backed by Redis cache-aside and fail-open PostgreSQL database fallback.
- **Custom Aliases & Base62 Generation**: Create brandable short slugs with automated collision retry logic.
- **Dynamic & Static QR Code Studio**: Render high-resolution PNG and SVG QR codes with custom foreground/background colors.
- **Privacy-Compliant Analytics**: SHA-256 IP anonymization (raw IPs are never stored) with real-time country, device, browser, OS, and referrer telemetry.
- **Enterprise Security**: JWT access/refresh token rotation with reuse detection, rate limiting, SSRF host protection, and role-based access control (RBAC).
- **Admin Dashboard & Moderation**: System health monitoring, global URL moderation, user banning/role management, and audit log history.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21 (LTS), Spring Boot 3.4.2, Spring Security, Spring Data JPA, Hibernate, JJWT 0.13.0, MapStruct, Lombok, Maven |
| **Database** | PostgreSQL 18, Flyway DB Migrations (V1 to V6) |
| **Cache** | Redis 8 (Cache-Aside + Rate Limiter) |
| **Frontend** | React 19, Vite 6.1, Tailwind CSS 3.4 / 4, Axios, React Router 7, TanStack Query 5, Lucide Icons |
| **DevOps** | Docker, Docker Compose, Nginx, Actuator Health & Readiness Probes, GitHub Actions CI Pipeline |

---

## 📋 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login and issue access & refresh tokens |
| `POST` | `/api/auth/refresh` | Rotate refresh token |
| `POST` | `/api/v1/urls` | Create short URL or custom alias |
| `GET` | `/api/v1/urls` | Get user's short URLs (paginated) |
| `GET` | `/{shortCode}` | Public redirect execution (302 Found) |
| `POST` | `/{shortCode}/verify` | Unlock password-protected short link |
| `GET` | `/api/v1/analytics/{urlId}` | Get complete URL analytics telemetry |
| `GET` | `/api/v1/qr-codes/{id}/download` | Download PNG/SVG QR code image |
| `GET` | `/api/v1/admin/dashboard` | Admin platform metrics & system health |

---

## ⚙️ Quick Start

### 1. Run with Docker Compose
```bash
docker compose up -d --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger OpenAPI: `http://localhost:8080/swagger-ui.html`

### 2. Manual Development Setup
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📄 License
Released under the MIT License. Built with Java 21 & React 19.
