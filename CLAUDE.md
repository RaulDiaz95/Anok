# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Anok is a modern event management platform built as a monorepo with:
- **Backend**: Spring Boot 3.2 REST API (Java 17)
- **Frontend**: React 18.3 + TypeScript + Vite
- **Database**: PostgreSQL 15 with Flyway migrations
- **Infrastructure**: AWS CDK for cloud resources (S3 for file uploads)
- **Authentication**: JWT-based auth with HttpOnly cookies

## Development Commands

### Initial Setup
```bash
npm run install:webapp    # Install frontend dependencies (uses pnpm)
```

### Development
```bash
npm run dev               # Start database, backend, and frontend (all-in-one)
npm run clean             # Stop all services and delete all data
```

This starts:
- PostgreSQL (port 5432)
- Spring Boot backend (port 8080) at `http://localhost:8080/api`
- React frontend (port 5173) at `http://localhost:5173`

### Backend (from /backend directory)
```bash
./mvnw spring-boot:run                      # Run backend only
./mvnw test                                 # Run tests
./mvnw clean package                        # Build JAR
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod  # Run with prod profile
```

### Frontend (from /webapp directory)
```bash
pnpm dev                  # Start dev server
pnpm build                # Build for production
pnpm preview              # Preview production build
```

### Database
```bash
docker compose up -d      # Start PostgreSQL only
docker compose down       # Stop database
docker compose logs -f postgres  # View database logs
docker compose exec postgres psql -U postgres -d anok_db  # Connect to database
```

## Architecture

### Backend Structure (`/backend/src/main/java/com/anok/`)

The backend follows standard Spring Boot layered architecture:

```
controller/     → REST endpoints (DO NOT include /api in @RequestMapping)
├── AuthController.java (auth/login, auth/register, auth/logout, auth/me)
├── EventController.java (events/**, events/{id})
├── AdminEventController.java (admin/events/** - SUPERUSER only)
└── UploadController.java (uploads/** - S3 presigned URLs)

model/          → JPA entities
├── User.java (users table, email-based auth)
├── Role.java (enum: USER, SUPERUSER)
├── Event.java (events table with status workflow)
├── EventGenre.java (many-to-many event genres)
├── EventPerformer.java (event performers)
└── EventStatus.java (enum: PENDING_REVIEW, APPROVED, REJECTED)

repository/     → Spring Data JPA repositories
service/        → Business logic
├── JwtService.java (JWT generation/validation)
├── EventService.java (event CRUD)
└── S3Service.java (AWS S3 file uploads)

dto/            → Data transfer objects
security/       → JWT authentication
├── JwtAuthenticationFilter.java (extracts JWT from cookies)
└── CustomUserDetailsService.java (loads users for auth)

config/         → Spring configuration
├── SecurityConfig.java (security rules, public/protected endpoints)
├── CorsConfig.java (CORS configuration)
└── PasswordEncoderConfig.java (BCrypt password encoder)

exception/      → Global exception handling
```

**Important Backend Conventions:**
- All endpoints automatically prefixed with `/api` (configured in `application.yml`)
- Controllers should use `@RequestMapping("/events")` NOT `@RequestMapping("/api/events")`
- Public endpoints: `/auth/**`, `/actuator/health`, `/swagger-ui/**`, `GET /events/**`, `GET /uploads/**`
- Protected endpoints: Everything else requires JWT authentication
- Admin endpoints: `/admin/**` requires SUPERUSER role

### Frontend Structure (`/webapp/src/`)

```
routes/         → Page components
├── AppRoutes.tsx (React Router configuration)
├── Events.tsx (public events listing)
├── EventDetail.tsx (single event view)
├── MyEvents.tsx (user's events - protected)
├── CreateEvent.tsx (event creation - protected)
├── AdminReviewEvents.tsx (admin event review - SUPERUSER)
├── Login.tsx, Signup.tsx
└── dashboard/ (future dashboard views)

components/     → Reusable UI components
services/       → API communication
├── authService.ts (login, register, logout, getCurrentUser)
├── eventService.ts (getEvents, getEvent, createEvent, updateEvent)
└── adminEventService.ts (admin event management)

contexts/       → React context providers
└── AuthContext.tsx (user authentication state)

types/          → TypeScript type definitions
config/         → Frontend configuration
```

**Frontend Architecture Notes:**
- Uses TanStack React Query for server state management (not currently implemented)
- Authentication via HttpOnly cookies (no localStorage)
- API base URL configured in `webapp/.env` as `VITE_API_URL`
- All API calls include `credentials: 'include'` for cookie handling

### Database Migrations (`/backend/src/main/resources/db/migration/`)

Flyway manages schema migrations automatically on startup:

**Creating New Migrations:**
1. Create file: `V{next_number}__{description}.sql` (e.g., `V13__add_ticket_types.sql`)
2. Write DDL (CREATE TABLE, ALTER TABLE, etc.)
3. Test locally with `npm run dev`
4. Commit and deploy

**Migration Rules:**
- NEVER modify applied migrations
- Use sequential versioning (V1, V2, V3...)
- Use idempotent SQL when possible (`IF NOT EXISTS`)
- Test on local database before production
- Flyway validates checksums on startup

**Current Schema:**
- `users` - User accounts with email/password
- `roles` - User roles (USER, SUPERUSER)
- `user_roles` - User-role junction table
- `events` - Event records with status workflow
- `event_genres` - Event genre associations
- `event_performers` - Event performer information

### Authentication Flow

**JWT Authentication with HttpOnly Cookies:**

1. **Login** → `POST /api/auth/login`
   - Backend validates credentials
   - Generates JWT access token
   - Sets HttpOnly cookie: `access_token`
   - Returns user object

2. **Authenticated Requests**
   - Frontend sends requests with `credentials: 'include'`
   - `JwtAuthenticationFilter` extracts JWT from cookie
   - Validates token and sets Spring Security context
   - Controller receives authenticated user via `@AuthenticationPrincipal`

3. **Logout** → `POST /api/auth/logout`
   - Backend clears `access_token` cookie
   - Frontend clears user state

4. **Authorization**
   - Public: `/auth/**`, `/actuator/health`, `GET /events/**`
   - Authenticated: All other endpoints
   - SUPERUSER: `/admin/**` endpoints

**Security Features:**
- HttpOnly cookies prevent XSS token theft
- SameSite cookie attribute (CSRF protection)
- BCrypt password hashing (strength: 12)
- Stateless JWT validation (no server-side sessions)
- Token expiration: 1 hour (access), 7 days (refresh - not implemented)

### Event Management System

**Event Lifecycle:**
1. User creates event → `status: PENDING_REVIEW`
2. Admin reviews → approves (`APPROVED`) or rejects (`REJECTED`)
3. Only `APPROVED` events visible to public
4. Users can view their own events regardless of status

**Event Properties:**
- Core: title, description, eventDateTime, venueName, venueAddress
- Location: venueZipCode, venueState, venueCountry
- Details: capacity, ageRestriction, allAges, alcohol
- Media: flyerUrl (S3 presigned URL)
- Relationships: owner (User), genres (EventGenre), performers (EventPerformer)
- Metadata: isLive, status, createdAt, updatedAt

**Event Endpoints:**
- `GET /api/events` - List approved events (public)
- `GET /api/events/{id}` - Single event (public if approved)
- `POST /api/events` - Create event (authenticated)
- `GET /api/events/my-events` - User's events (authenticated)
- `PUT /api/admin/events/{id}/approve` - Approve event (SUPERUSER)
- `PUT /api/admin/events/{id}/reject` - Reject event (SUPERUSER)

### File Upload System

**AWS S3 Integration:**
- Files uploaded directly to S3 from frontend
- Backend generates presigned URLs for secure uploads
- CloudFront distribution for CDN (optional)

**Upload Flow:**
1. Frontend requests presigned URL → `POST /api/uploads/presigned-url`
2. Backend generates S3 presigned URL (15min expiration)
3. Frontend uploads file directly to S3 using presigned URL
4. Store resulting S3 URL in event `flyerUrl`

**Configuration:**
- S3 bucket: `S3_BUCKET` env var
- Region: `AWS_REGION` (default: us-east-2)
- Prefix: `S3_PREFIX` (default: uploads/)
- Local dev: Uses AWS SSO credentials from `~/.aws`

### Configuration & Environment Variables

**Backend (`application.yml`):**
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_SECRET` - JWT signing key (change in production!)
- `CORS_ALLOWED_ORIGINS` - Frontend URLs for CORS
- `S3_BUCKET`, `AWS_REGION` - S3 configuration
- `CLOUDFRONT_DOMAIN`, `CLOUDFRONT_ENABLED` - CDN configuration
- `SPRING_PROFILES_ACTIVE` - Profile (dev/prod)

**Frontend (`webapp/.env`):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080/api)

**Docker Compose (`.env`):**
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` - Database config
- `AWS_PROFILE` - AWS SSO profile for local development

### Deployment

**Two Environments:**
- **Staging**: Auto-deploys from `develop` branch
- **Production**: Auto-deploys from `main` branch

**Render Deployment (`render.yaml`):**
- 2 PostgreSQL databases (staging + production)
- 2 Backend services (Spring Boot)
- 2 Frontend static sites (Vite build)

**Branch Strategy:**
- `main` → Production environment
- `develop` → Staging environment
- `feature/*` → Development branches (merge to develop)

**Post-Deployment Checklist:**
1. Update `CORS_ALLOWED_ORIGINS` in backend services with actual frontend URLs
2. Update `VITE_API_URL` in frontend services with actual backend URLs
3. Verify health checks: `/api/actuator/health`
4. Test database migrations in logs
5. Confirm CORS and authentication working

**AWS CDK Deployment (Optional - `/infra/`):**
- TypeScript-based infrastructure as code
- Deploys S3 buckets, CloudFront, etc.
- Run: `cd infra && npm run deploy`

## Common Development Patterns

### Adding a New Entity

1. Create entity in `/backend/src/main/java/com/anok/model/NewEntity.java`
2. Create repository in `/backend/src/main/java/com/anok/repository/NewEntityRepository.java`
3. Create service in `/backend/src/main/java/com/anok/service/NewEntityService.java`
4. Create DTOs in `/backend/src/main/java/com/anok/dto/NewEntityDTO.java`
5. Create controller in `/backend/src/main/java/com/anok/controller/NewEntityController.java`
6. Create migration in `/backend/src/main/resources/db/migration/V{n}__create_new_entity_table.sql`
7. Update SecurityConfig if needed for endpoint permissions

### Adding a Frontend Route

1. Create component in `/webapp/src/routes/NewPage.tsx`
2. Add route in `/webapp/src/routes/AppRoutes.tsx`
3. Create service in `/webapp/src/services/newService.ts` if API calls needed
4. Add TypeScript types in `/webapp/src/types/`

### Testing

Backend tests go in `/backend/src/test/java/com/anok/`
- Unit tests for services
- Integration tests for controllers
- Repository tests with `@DataJpaTest`

Frontend testing not currently configured.

## Key Technical Details

- **Context Path**: All API endpoints automatically prefixed with `/api`
- **CORS**: Configured globally in `CorsConfig.java`
- **Exception Handling**: Global handler catches all exceptions and returns appropriate HTTP status codes
- **Logging**: `com.anok` package logs at DEBUG level in dev profile
- **Hot Reload**: Spring DevTools enabled for backend, Vite HMR for frontend
- **Package Manager**: pnpm for frontend (configured in package.json)
- **Build Tool**: Maven wrapper (`./mvnw`) for backend
- **Database**: PostgreSQL 15, connection pooling via HikariCP
- **ORM**: Hibernate with JPA, validation mode (no auto DDL)
