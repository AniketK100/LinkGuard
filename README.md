# LinkGuard — URL Intelligence Platform

> A production-grade, stateful URL management and security platform built with **Java 21**, **Spring Boot 3**, **PostgreSQL**, **Redis**, and **Docker**.

---

## 📌 Overview

**LinkGuard** is not just another CRUD URL shortener. It treats every short link as an intelligent, stateful asset with a defined lifecycle, security posture, and real-time analytics profile.

### Highlights
- 🛡️ **Security Controls**: Password-protected links, expiry dates, domain blacklisting, rate limiting, and brute-force mitigation.
- ⚡ **Low-Latency Redirect Hot Path**: 302 Found redirects backed by Redis cache-aside design and fallback mechanics.
- 📊 **Real-Time Analytics Ingestion**: Asynchronous click event processing (`@Async`), user-agent parsing, and SHA-256 IP anonymization.
- 🏗️ **Clean Architecture**: Modular monolith pattern using package-by-feature organization (`auth`, `url`, `redirect`, `analytics`, `security`, `qr`, `admin`, `cache`, `common`).

---

## 🛠️ Technology Stack

| Layer | Stack |
|---|---|
| **Language & Core** | Java 21, Spring Boot 3.2.3 |
| **Security & Auth** | Spring Security, JWT (Stateless), BCrypt |
| **Data & Persistence** | PostgreSQL 16, Spring Data JPA, Hibernate |
| **Caching & Rate Limiting** | Redis 7 |
| **Database Migrations** | Flyway |
| **DTO Mapping** | MapStruct, Lombok |
| **API Documentation** | OpenAPI / Swagger (`springdoc-openapi`) |
| **Containerization** | Docker, Docker Compose |

---

## 📂 Repository Structure

```
LinkGuard/
├── docs/                                  # Architectural & Product Specifications
│   ├── 01_PRD.md                          # Product Requirements Document
│   ├── 02_TRD.md                          # Technical Requirements Document
│   ├── 03_App_Flow.md                     # Detailed Application Flows & Sequence Diagrams
│   ├── 04_UIUX_Design_Brief.md            # UI/UX Specifications & ASCII Wireframes
│   ├── 05_Backend_Schema_Data_Auth.md     # Database Schema, Contracts & Error Shapes
│   └── 06_Implementation_Plan_Build_Order.md # 14-Day Roadmap & Implementation Phases
├── src/
│   ├── main/
│   │   ├── java/com/app/urlintel/
│   │   │   ├── auth/                      # Authentication domain
│   │   │   ├── url/                       # URL management domain
│   │   │   ├── redirect/                  # High-performance redirect engine
│   │   │   ├── analytics/                 # Asynchronous analytics capture & aggregation
│   │   │   ├── security/                  # Rate limiting & domain blacklist
│   │   │   ├── qr/                        # QR code generator service
│   │   │   ├── admin/                     # Moderation & admin management
│   │   │   ├── cache/                     # Redis cache-aside wrappers
│   │   │   ├── common/                    # Shared config, exceptions, utilities
│   │   │   └── UrlIntelApplication.java   # Spring Boot Application Entry Point
│   │   └── resources/
│   │       ├── application.yml            # System configuration
│   │       └── db/migration/              # Versioned Flyway SQL migrations
│   │           └── V1__init_schema.sql
├── docker-compose.yml                     # PostgreSQL + Redis setup
├── .env.example                           # Environment configuration template
├── .gitignore                             # Git ignore rules
└── pom.xml                                # Maven build specification
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **JDK 21** or later
- **Maven 3.8+**
- **Docker & Docker Compose**

### 1. Clone the Repository
```bash
git clone https://github.com/Sahil-Ghorpade/LinkGuard.git
cd LinkGuard
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Infrastructure Services
Launch PostgreSQL 16 and Redis 7 in detached mode:
```bash
docker-compose up -d
```

### 4. Build and Run the Application
```bash
mvn clean compile
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

---

## 📊 Verification & Health Checks

- **Actuator Health Check**:
  ```bash
  curl -i http://localhost:8080/actuator/health
  ```
  Expected response: `HTTP/1.1 200 OK` `{"status":"UP"}`

- **OpenAPI / Swagger UI**:
  Access interactive API documentation at:
  `http://localhost:8080/swagger-ui.html`

---

## 🧪 Testing

Run unit and integration tests:
```bash
mvn clean test
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
