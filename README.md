# Anok Platform

A modern monorepo platform with Spring Boot REST API backend and frontend application.

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose (for PostgreSQL)
- Node.js 18+ (for frontend)
- pnpm (for frontend package management)

### Start Development (Everything in One Command)

**First time setup:**
```bash
npm run install:webapp
```

**Start everything:**
```bash
npm run dev
```

That's it! This single command will:
1. Start PostgreSQL database (Docker)
2. Start the Spring Boot backend API
3. Start the React frontend (Vite)

**Access your application:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html
- **Health Check:** http://localhost:8080/api/actuator/health

### Fresh Start

To clean everything and start fresh:

```bash
npm run clean && npm run dev
```

This will:
- Stop all services
- Delete database data
- Clean Maven build
- Restart everything

## Health Check

The application provides a production-ready health check endpoint powered by Spring Boot Actuator.

**URL:** `http://localhost:8080/api/actuator/health`

**What it monitors:**
- **Database connectivity** - Verifies PostgreSQL connection
- **Application status** - Overall application health
- **HTTP Status Codes:**
  - `200 OK` - All systems operational
  - `503 Service Unavailable` - Database or service is down

**Example Response (Healthy):**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

**Example Response (Database Down):**
```json
{
  "status": "DOWN",
  "components": {
    "db": {
      "status": "DOWN",
      "details": {
        "error": "Connection refused"
      }
    }
  }
}
```

**Configuration:**
- **Development:** Shows detailed component health
- **Production:** Shows basic status only (for security)

## API Documentation

### Available Endpoints

#### Health Check
- `GET /api/actuator/health` - System health with database check

#### API Documentation
- `GET /api/swagger-ui.html` - Interactive API documentation
- `GET /api-docs` - OpenAPI JSON specification

## Available Scripts

From the root directory:

- **`npm run dev`** - Start everything (Database + Backend + Frontend)
- **`npm run clean`** - Stop and reset everything (removes all data)
- **`npm run install:webapp`** - Install frontend dependencies
- **`npm run build:webapp`** - Build frontend for production

## Technology Stack

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite 5.4.8
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** TanStack React Query
- **Animations:** Framer Motion
- **Package Manager:** pnpm

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **Migrations:** Flyway
- **Documentation:** Swagger/OpenAPI (springdoc-openapi)
- **Monitoring:** Spring Boot Actuator
- **Build:** Maven
- **DevTools:** Lombok, Spring DevTools

## Database Setup

### Automatic Start

The database starts automatically when you run `npm run dev`.

### Manual Database Control (Advanced)

If you prefer manual control over the database:

```bash
# Start database only
docker compose up -d

# Stop database
docker compose down

# View database logs
docker compose logs -f postgres

# Connect to database
docker compose exec postgres psql -U postgres -d anok_db
```

**Database Connection Details:**
- Host: localhost
- Port: 5432
- Database: anok_db
- Username: postgres
- Password: postgres

Configure these in the `.env` file at the root directory.

## Frontend Setup

The frontend is a React + TypeScript application built with Vite. It's fully integrated into the monorepo.

### First Time Setup

Install frontend dependencies:
```bash
npm run install:webapp
```

### Development

The frontend runs automatically with `npm run dev`. It will be available at http://localhost:5173

### API Integration

The frontend is configured to connect to the backend API at `http://localhost:8080/api`. This is set in `webapp/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

You can change this URL by editing `webapp/.env` for different environments.

### Building for Production

```bash
npm run build:webapp
```

This creates an optimized production build in `webapp/dist/`.

## Development

### Backend Development

- **Hot Reload:** Enabled with Spring DevTools
- **Code Style:** Follow Java conventions
- **Database Migrations:** Create new migrations in `backend/src/main/resources/db/migration/`
  - Format: `V{number}__{description}.sql` (e.g., `V1__create_users_table.sql`)

### Adding New Features

1. **Create Entity** in `backend/src/main/java/com/anok/model/`
2. **Create Repository** in `backend/src/main/java/com/anok/repository/`
3. **Create Service** in `backend/src/main/java/com/anok/service/`
4. **Create DTOs** in `backend/src/main/java/com/anok/dto/`
5. **Create Controller** in `backend/src/main/java/com/anok/controller/`
6. **Add Migration** in `backend/src/main/resources/db/migration/`

**Important:** Controllers should NOT include `/api` in their `@RequestMapping` path. The context path `/api` is automatically added to all endpoints.

Example:
```java
@RestController
@RequestMapping("/users")  // Will be accessible at /api/users
public class UserController {
    @GetMapping("/{id}")  // Will be /api/users/{id}
    public User getUser(@PathVariable Long id) {
        // ...
    }
}
```

### Exception Handling

The project includes a global exception handler that catches:
- `ResourceNotFoundException` - Returns 404
- `ValidationException` - Returns 400
- `MethodArgumentNotValidException` - Returns 400 with field errors
- `IllegalArgumentException` - Returns 400
- All other exceptions - Returns 500

## Docker Support

The project uses Docker Compose for PostgreSQL. Everything is automated via `npm run dev`.

**Manual Docker commands (if needed):**
```bash
# View logs
docker compose logs -f postgres

# Access database
docker compose exec postgres psql -U postgres -d anok_db
```

## Environment Variables

### Docker Compose (.env)

The root `.env` file configures the PostgreSQL database:

```env
POSTGRES_DB=anok_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
```

See `.env.example` for a template.

### Backend (application.yml)

For production deployment using environment variables:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: anok_db)
- `DB_USER` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (default: http://localhost:5173)
- `PORT` - Application server port (default: 8080)
- `ENABLE_API_DOCS` - Enable API documentation (default: false in production)
- `ENABLE_SWAGGER_UI` - Enable Swagger UI (default: false in production)

## Configuration Profiles

The backend supports multiple profiles:

- **dev** - Development mode (default)
  - Hot reload enabled
  - Detailed logging
  - CORS enabled for localhost
  - Full health details shown

- **prod** - Production mode
  - Optimized settings
  - Environment-based configuration
  - Security hardened
  - Minimal health details shown

Run with a specific profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## Deployment

### Deploy to Render

The project includes a `render.yaml` blueprint for automated deployment to Render with both staging and production environments.

#### Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Git Branches**: See Git Workflow section below

#### Git Workflow & Branch Strategy

This project uses a two-branch deployment strategy:

**Branch Structure:**
```
main (production)
  ↓
develop (staging)
  ↓
feature/* (development)
```

**Branch Purposes:**

- **`main`** - Production environment
  - Auto-deploys to production Render services
  - Only merge from `develop` after thorough testing
  - Protected branch (recommend requiring PR reviews)

- **`develop`** - Staging environment
  - Auto-deploys to staging Render services
  - Integration branch for testing features
  - Merge feature branches here first

- **`feature/*`** - Feature development
  - Create from `develop` for new features
  - Format: `feature/feature-name`
  - Merge back to `develop` via PR

**Creating the develop Branch:**

If `develop` branch doesn't exist yet:
```bash
# From main branch
git checkout main
git pull origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

**Development Workflow:**

1. **New Feature**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   # Make changes
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

2. **Deploy to Staging**:
   ```bash
   # Create PR: feature/my-feature → develop
   # After PR approval, merge to develop
   # Render automatically deploys to staging
   ```

3. **Deploy to Production**:
   ```bash
   # Test on staging thoroughly
   # Create PR: develop → main
   # After PR approval, merge to main
   # Render automatically deploys to production
   ```

**Important Notes:**
- Never commit directly to `main` or `develop`
- Always use Pull Requests for code review
- Test on staging before promoting to production
- Keep `develop` in sync with `main` after production releases

#### Quick Deploy

1. **Connect Repository to Render**:
   - Go to Render Dashboard → Blueprints
   - Click "New Blueprint Instance"
   - Connect your GitHub repository
   - Select the repository containing `render.yaml`

2. **Render will automatically create**:
   - 2 PostgreSQL databases (staging + production)
   - 2 Backend API services (staging + production)
   - 2 Frontend static sites (staging + production)

3. **Update Environment Variables** (Important):

   After deployment, you need to update these URLs:

   **Backend Services** (both staging & production):
   - Update `CORS_ALLOWED_ORIGINS` with your actual frontend URLs
   - Example: `https://anok-frontend-prod.onrender.com`

   **Frontend Services** (both staging & production):
   - Update `VITE_API_URL` with your actual backend URLs
   - Example: `https://anok-api-prod.onrender.com/api`

#### Post-Deployment Checklist

Follow these steps after your initial deployment to Render:

**Step 1: Wait for Services to Deploy** (5-10 minutes)
- [ ] Check Render Dashboard - all services show "Live" status
- [ ] Verify databases show "Available" status

**Step 2: Get Service URLs**
- [ ] Note backend staging URL: `https://anok-api-staging.onrender.com`
- [ ] Note backend production URL: `https://anok-api-prod.onrender.com`
- [ ] Note frontend staging URL: `https://anok-frontend-staging.onrender.com`
- [ ] Note frontend production URL: `https://anok-frontend-prod.onrender.com`

**Step 3: Update Backend Environment Variables**

For **anok-api-staging**:
- [ ] Go to Service → Environment
- [ ] Update `CORS_ALLOWED_ORIGINS` to: `https://anok-frontend-staging.onrender.com`
- [ ] Click "Save Changes" (triggers automatic redeploy)

For **anok-api-prod**:
- [ ] Go to Service → Environment
- [ ] Update `CORS_ALLOWED_ORIGINS` to: `https://anok-frontend-prod.onrender.com`
- [ ] Click "Save Changes" (triggers automatic redeploy)

**Step 4: Update Frontend Environment Variables**

For **anok-frontend-staging**:
- [ ] Go to Service → Environment
- [ ] Update `VITE_API_URL` to: `https://anok-api-staging.onrender.com/api`
- [ ] Click "Save Changes" (triggers automatic redeploy)

For **anok-frontend-prod**:
- [ ] Go to Service → Environment
- [ ] Update `VITE_API_URL` to: `https://anok-api-prod.onrender.com/api`
- [ ] Click "Save Changes" (triggers automatic redeploy)

**Step 5: Wait for Redeployments** (3-5 minutes)
- [ ] All services show "Live" status again

**Step 6: Verify Staging Environment**
- [ ] Visit staging frontend: Should load without errors
- [ ] Open browser console: Check for CORS errors (should be none)
- [ ] Test contact form: Should connect to backend successfully
- [ ] Visit backend health: `https://anok-api-staging.onrender.com/api/actuator/health`
- [ ] Verify database status is "UP" in health response

**Step 7: Verify Production Environment**
- [ ] Visit production frontend: Should load without errors
- [ ] Open browser console: Check for CORS errors (should be none)
- [ ] Test contact form: Should connect to backend successfully
- [ ] Visit backend health: `https://anok-api-prod.onrender.com/api/actuator/health`
- [ ] Verify database status is "UP" in health response

**Step 8: Test Database Migrations**
- [ ] Check backend logs for Flyway migration success messages
- [ ] Verify `flyway_schema_history` table exists in database
- [ ] Confirm all migrations completed successfully

**Step 9: Optional - Set Up Custom Domain**
- [ ] Add custom domain in Render Dashboard (if desired)
- [ ] Configure DNS records
- [ ] Update CORS_ALLOWED_ORIGINS to include custom domain
- [ ] Test with custom domain

**Step 10: Configure Monitoring**
- [ ] Set up email notifications for service failures
- [ ] Configure health check alerts
- [ ] Consider external monitoring (UptimeRobot, Pingdom)

**Troubleshooting During Checklist:**
- If CORS errors persist: Double-check URLs don't have trailing slashes
- If frontend can't reach API: Verify VITE_API_URL includes `/api` path
- If database connection fails: Check database is in same region as services
- If builds fail: Check Render build logs for specific errors

#### Service URLs

After deployment, your services will be available at:

**Production:**
- Frontend: `https://anok-frontend-prod.onrender.com`
- Backend API: `https://anok-api-prod.onrender.com/api`
- Health Check: `https://anok-api-prod.onrender.com/api/actuator/health`

**Staging:**
- Frontend: `https://anok-frontend-staging.onrender.com`
- Backend API: `https://anok-api-staging.onrender.com/api`
- Health Check: `https://anok-api-staging.onrender.com/api/actuator/health`

#### Custom Domain Setup (Optional)

For path-based routing with a custom domain (e.g., `yourdomain.com` and `yourdomain.com/api`):

1. **Add Custom Domain in Render**:
   - Go to your frontend service → Settings → Custom Domains
   - Add `yourdomain.com`

2. **Configure DNS**:
   - Add CNAME record pointing to Render

3. **Update Environment Variables**:
   - Frontend `VITE_API_URL`: Keep as Render backend URL initially
   - OR set up a reverse proxy/API gateway for true path-based routing

**Note**: True path-based routing (same domain for frontend/API) requires additional configuration beyond Render's standard setup. Consider using:
- Cloudflare Workers for routing
- API Gateway service
- Subdomain approach (simpler): `app.yourdomain.com` + `api.yourdomain.com`

#### Environment Files

The project includes environment-specific configuration files:

- `webapp/.env` - Local development (not committed)
- `webapp/.env.example` - Template with all options
- `webapp/.env.staging` - Staging environment template
- `webapp/.env.production` - Production environment template

Update `.env.staging` and `.env.production` with your actual Render URLs.

#### Deployment Workflow

**Automatic Deployments:**
- Push to `main` → Production deploys automatically
- Push to `develop` → Staging deploys automatically

**Manual Deployment:**
- Go to service in Render Dashboard
- Click "Manual Deploy" → "Deploy latest commit"

#### Database Migrations

The backend uses **Flyway** for database schema migrations. Migrations run automatically on application startup.

**How It Works:**

1. **First Deployment** (Empty Database):
   - Flyway creates `flyway_schema_history` table
   - Runs baseline migration (if configured)
   - Executes all migration files in order

2. **Subsequent Deployments**:
   - Flyway checks `flyway_schema_history` for applied migrations
   - Only runs new migrations that haven't been applied
   - Updates schema history table after each migration

**Migration Files Location:**
```
backend/src/main/resources/db/migration/
├── V1__create_users_table.sql
├── V2__add_user_roles.sql
└── V3__create_orders_table.sql
```

**Naming Convention:**
- Format: `V{number}__{description}.sql`
- Examples:
  - `V1__initial_schema.sql`
  - `V2__add_email_to_users.sql`
  - `V3__create_products_table.sql`

**Creating New Migrations:**

1. Create new SQL file in `backend/src/main/resources/db/migration/`
2. Follow naming convention (increment version number)
3. Write DDL statements (CREATE, ALTER, etc.)
4. Test locally first: `npm run dev`
5. Commit and push to trigger deployment

**Verifying Migrations:**

After deployment, check backend logs in Render:
```
✓ Flyway: Successfully applied 3 migrations
✓ Flyway: Schema version: 3
```

Or query the database:
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

**Important Notes:**

- **Never modify applied migrations** - Always create new ones
- **Test migrations locally** before pushing to production
- **Backup production database** before major schema changes
- **Rollback strategy**: Create reverse migration if needed
- **Failed migrations**: Fix the SQL and redeploy (Flyway will retry)

**Migration Best Practices:**

1. **Idempotent Migrations**: Use `IF NOT EXISTS` where possible
   ```sql
   CREATE TABLE IF NOT EXISTS users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL
   );
   ```

2. **Data Migrations**: Separate from schema migrations when complex
3. **Large Migrations**: Consider batch processing for large data changes
4. **Testing**: Always test on staging before production

**Troubleshooting Migrations:**

- **Migration fails**: Check backend logs for SQL errors
- **Schema version mismatch**: Verify all migrations are committed
- **Stuck migration**: May need to manually update `flyway_schema_history`
- **Need to rollback**: Create new migration with reverse changes

#### Monitoring

- **Health Checks**: Render monitors `/api/actuator/health` automatically
- **Logs**: Available in Render Dashboard for each service
- **Alerts**: Configure in Render Dashboard → Service → Settings

#### Cost Optimization

**Free Tier**:
- Static sites: Free
- Web services: Free (spins down after inactivity)
- PostgreSQL: Free starter plan available

**Recommendations**:
- Use free tier for staging
- Upgrade to paid plans for production (no spin-down)
- Combine staging database for cost savings (if data separation not critical)

#### Troubleshooting Deployment

**Database Connection Issues**:
- Verify database environment variables are correctly set
- Check Render logs for connection errors
- Ensure PostgreSQL instance is running

**CORS Errors**:
- Update `CORS_ALLOWED_ORIGINS` in backend service
- Include both Render URL and custom domain (if applicable)
- Check browser console for specific CORS errors

**Build Failures**:
- Check build logs in Render Dashboard
- Verify `render.yaml` syntax
- Ensure all dependencies are in `package.json` / `pom.xml`

**Frontend Not Loading**:
- Verify `VITE_API_URL` is set correctly
- Check if backend is healthy: visit `/api/actuator/health`
- Inspect browser network tab for API call failures

## Troubleshooting

### Database Connection Issues

If you see "Connection refused" errors:

1. **Verify PostgreSQL is running:**
   ```bash
   docker compose ps
   ```

2. **Check database logs:**
   ```bash
   docker compose logs postgres
   ```

3. **Test database connectivity:**
   ```bash
   docker compose exec postgres pg_isready -U postgres
   ```

4. **Check health endpoint:**
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

### Port Already in Use

If port 8080 or 5432 is already in use:

```bash
# Find process using port
lsof -i :8080
lsof -i :5432

# Kill the process or change the port in application.yml / .env
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Create a pull request

## License

(Add your license information here)
