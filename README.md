# LinkGuard — Intelligent URL Management & Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-orange.svg)](#architecture)

**LinkGuard** is an intelligent URL management and analytics platform engineered with a high-performance **Modular Monolith** architecture in Java and Spring Boot, coupled with a modern React SPA dashboard.

---

## 🌟 Key Capabilities

- **URL Shortening & Custom Aliases**: Base62 short code generation with automatic collision retries and reserved-word filtering.
- **High-Performance Redirect Engine**: Sub-100ms p95 redirect latency backed by Redis cache-aside reads.
- **Asynchronous Click Analytics**: Non-blocking `@Async` click event recording with IP anonymization (SHA-256 + salt), User-Agent parsing, and geo-location classification.
- **Advanced Link Security**: Expiring links, bcrypt password-protected links, domain blacklist checks, and Redis rate limiting.
- **Rich Analytics Dashboard**: Real-time traffic breakdown by browser, OS, device, country, and time-series charts.
- **QR Code Generation**: PNG stream generation for every short link.

---

## 🏗️ Architecture & Technology Stack

```
LinkGuard Monolith
├── backend/       # Spring Boot Application (Java LTS, Spring Security, Spring Data JPA, Redis, Flyway)
├── frontend/      # React SPA (Vite, Tailwind CSS, Axios, React Router, TanStack Query)
├── docker/        # Multi-stage Dockerfiles
├── docs/          # Product & Technical Specifications
└── .github/       # Automated CI Workflows
```

### Stack Overview
- **Backend**: Java (Latest LTS), Spring Boot (Latest Stable), Spring Security (JWT), Spring Data JPA, PostgreSQL, Redis, Flyway, Maven
- **Frontend**: React (Latest Stable), Vite, Tailwind CSS, Axios, React Router, TanStack Query
- **Docs & Testing**: OpenAPI / Swagger (`springdoc-openapi`), JUnit 5, Mockito
- **DevOps**: Docker, Docker Compose, GitHub Actions

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Java JDK (Latest LTS) & Maven (optional for containerized setup)
- Node.js (Latest LTS) & npm (optional for containerized setup)

### 1. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

### 2. Start Services with Docker Compose
```bash
docker-compose up --build
```

Access the applications:
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **Swagger OpenAPI Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 📚 Project Documentation

The repository contains comprehensive technical documentation in the [`docs/`](./docs) directory:

1. [Product Requirements Document (PRD)](./docs/01_PRD.md)
2. [Technical Requirements Document (TRD)](./docs/02_TRD.md)
3. [Application Flow & Sequence Diagrams](./docs/03_App_Flow.md)
4. [UI/UX Design Brief & Wireframes](./docs/04_UIUX_Design_Brief.md)
5. [Backend Schema, Data Model & Auth Contracts](./docs/05_Backend_Schema_Data_Auth.md)
6. [Implementation Plan & Engineering Roadmap](./docs/06_Implementation_Plan_Build_Order.md)

---

## 📄 License
This project is licensed under the MIT License.
