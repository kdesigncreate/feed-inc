# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a full-stack web application for Feed Inc., a promotional planning company. It consists of:
- **Backend**: Laravel 12 API with MySQL database
- **Frontend**: Next.js 14 React application with TypeScript
- **Deployment**: Docker Compose with Nginx reverse proxy

## Development Commands

### Backend (Laravel)
```bash
cd backend

# Development (includes Laravel server, queue worker, and Vite)
composer dev

# Testing
composer test
# OR
php artisan test

# Code formatting
./vendor/bin/pint

# Database migrations
php artisan migrate

# Database seeding
php artisan db:seed

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### Frontend (Next.js)
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Production server
npm run start

# Linting
npm run lint
```

### Docker Operations (via Makefile)
```bash
# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Check service status
make status

# Development setup (SSL + security keys)
make dev

# Security audit
make security-audit

# Additional operations
make restart              # Restart all services
make backup               # Backup database and SSL certificates
make production-check     # Pre-deployment checks
make ci-security         # CI security checks
make setup-git-hooks     # Setup pre-commit security hooks
```

## Architecture Overview

### Backend Structure
- **Authentication**: Laravel Sanctum with SPA cookie-based authentication (not token-based)
- **Models**: User (with admin role support) and Article (with slug-based routing)
- **API Routes**: Public article endpoints + admin-protected article management
- **Middleware**: Custom `AuthenticateJson` and `AdminMiddleware` for role-based access
- **Security**: Comprehensive security headers, CSRF protection, input validation

### Frontend Structure
- **Authentication**: React Context with SPA cookie authentication
- **Routing**: Next.js App Router with role-based access control
- **Admin Panel**: Protected routes for article management (`/admin/*`)
- **Components**: Modular design with security-focused components (CSP, performance optimization)
- **API Integration**: Axios with automatic CSRF cookie handling

### Security Features
- Content Security Policy (CSP) with nonce-based inline script protection
- Comprehensive security headers via middleware
- Input validation and sanitization
- Role-based access control
- Docker security hardening with read-only containers where possible

## Key Files and Directories

### Backend Key Files
- `backend/routes/api.php` - API route definitions
- `backend/app/Http/Controllers/AuthController.php` - Authentication logic
- `backend/app/Http/Controllers/ArticleController.php` - Article CRUD operations
- `backend/app/Http/Controllers/ImageUploadController.php` - Image upload handling
- `backend/app/Http/Middleware/AuthenticateJson.php` - Custom auth middleware
- `backend/app/Http/Middleware/AdminMiddleware.php` - Admin role verification
- `backend/app/Http/Middleware/SecurityHeaders.php` - Security headers middleware
- `backend/config/cors.php` - CORS configuration
- `backend/database/migrations/` - Database schema definitions

### Frontend Key Files
- `frontend/src/app/layout.tsx` - Root layout with security setup
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/lib/api.ts` - API client with CSRF handling
- `frontend/src/components/ProtectedRoute.tsx` - Route protection
- `frontend/src/components/CSPProvider.tsx` - Content Security Policy provider
- `frontend/src/components/PerformanceOptimizer.tsx` - Performance optimization component
- `frontend/middleware.ts` - Next.js middleware for security headers

### Configuration Files
- `docker-compose.yml` - Multi-container orchestration
- `nginx.conf` - Reverse proxy configuration
- `Makefile` - Development and deployment automation
- `.env.docker` - Docker environment variables (not in repo)

## Database

- **Primary**: MySQL 8.0
- **Tables**: users (with admin role support), articles (with slug-based routing), sessions, personal_access_tokens, cache, jobs
- **Seeding**: Admin user and sample articles via seeders
- **Migrations**: Located in `backend/database/migrations/`
- **Test Database**: `feed_inc_test` (configured in `backend/phpunit.xml`)

## Testing

### Backend Testing
- PHPUnit configuration in `backend/phpunit.xml`
- Test database: `feed_inc_test` (MySQL)
- Run tests: 
  ```bash
  cd backend
  ./vendor/bin/phpunit --testdox
  # OR
  composer test
  php artisan test
  
  # Single test file
  ./vendor/bin/phpunit tests/Feature/AuthTest.php
  
  # Specific test method
  ./vendor/bin/phpunit --filter testLogin
  ```
- Test coverage includes:
  - Authentication (login, logout, user retrieval, CSRF)
  - Article management (CRUD operations, permissions)
  - API validation and security

### Frontend Testing
- ESLint configuration for code quality
- Run linting: 
  ```bash
  cd frontend
  npm run lint
  ```

## Notes

- Registration is disabled by design - admin accounts must be created manually
- Article slugs are auto-generated, with Japanese title fallback to random strings
- CSRF tokens are handled automatically via Laravel Sanctum SPA authentication
- All Docker services include security hardening (no-new-privileges, read-only where possible)
- SSL certificates can be managed via Makefile commands for both development and production

## Server Deployment

### Production Server Details
- **Server**: root@162.43.87.222
- **SSH Key**: /home/kenta/.ssh/feed-sshkey.pem
- **Project Path**: /var/www/feed-inc/
- **Database**: MySQL (running in Docker container)

### Deployment Process
When deploying changes to the production server, follow these steps **exactly**:

```bash
# 1. Upload changes (excluding build artifacts)
rsync -avz -e "ssh -i /home/kenta/.ssh/feed-sshkey.pem" \
  --exclude=node_modules --exclude=vendor --exclude=.git \
  /home/kenta/feed-inc/ root@162.43.87.222:/var/www/feed-inc/

# 2. SSH into server and restart containers
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose restart"

# 3. Wait for containers to fully start (important!)
sleep 15

# 4. Verify services are running
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose ps"
```

### Important Notes for Deployment
- **NEVER** run fresh migrations on production unless explicitly requested
- **NEVER** change database configuration (.env files) without checking current setup first
- **ALWAYS** restart Docker containers after uploading changes
- **ALWAYS** wait for containers to fully start before proceeding
- The production database is MySQL in Docker, not SQLite
- Frontend builds are handled automatically by Docker containers

### Common Deployment Issues and Solutions
1. **Database connection errors**: Restart containers and wait for MySQL to fully initialize
2. **Permission issues**: Files are automatically handled by Docker user permissions
3. **Cache issues**: Container restart clears all necessary caches automatically
4. **Frontend not updating**: Next.js builds automatically in production mode

### Verification Commands
```bash
# Check all services are healthy
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose ps"

# Check application is responding
curl -I https://www.feed-inc.com/
```

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.