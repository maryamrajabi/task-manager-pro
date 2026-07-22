# Backend Architecture

## Architecture Style

Task Manager Pro uses a:

**Layered Monolith with Feature-Oriented Packaging**

- **Monolith:** The backend is deployed as one Spring Boot application.
- **Layered Architecture:** Responsibilities are separated between controllers, services, repositories, domain models, and infrastructure.
- **Feature-Oriented Packaging:** Related classes are grouped by features such as `auth`, `user`, and later `task`.

## Request Flow

```text
HTTP Request
    ↓
SecurityFilterChain
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / Hibernate
    ↓
PostgreSQL
```