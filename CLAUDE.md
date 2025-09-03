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
- `backend/app/Http/Middleware/AuthenticateJson.php` - Custom auth middleware
- `backend/config/cors.php` - CORS configuration
- `backend/database/migrations/` - Database schema definitions

### Frontend Key Files
- `frontend/src/app/layout.tsx` - Root layout with security setup
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/lib/api.ts` - API client with CSRF handling
- `frontend/src/components/ProtectedRoute.tsx` - Route protection
- `frontend/middleware.ts` - Next.js middleware for security headers

### Configuration Files
- `docker-compose.yml` - Multi-container orchestration
- `nginx.conf` - Reverse proxy configuration
- `Makefile` - Development and deployment automation
- `.env.docker` - Docker environment variables (not in repo)

## Database

- **Primary**: MySQL 8.0
- **Tables**: users, articles, sessions, personal_access_tokens
- **Seeding**: Admin user and sample articles via seeders

## Testing

### Backend Testing
- PHPUnit configuration in `backend/phpunit.xml`
- Test database: `feed_inc_test` (MySQL)
- Run tests: `./vendor/bin/phpunit --testdox`
- Test coverage includes:
  - Authentication (login, logout, user retrieval, CSRF)
  - Article management (CRUD operations, permissions)
  - API validation and security

### Frontend Testing
- ESLint configuration for code quality
- Run linting with `npm run lint`

## Notes

- Registration is disabled by design - admin accounts must be created manually
- Article slugs are auto-generated, with Japanese title fallback to random strings
- CSRF tokens are handled automatically via Laravel Sanctum SPA authentication
- All Docker services include security hardening (no-new-privileges, read-only where possible)
- SSL certificates can be managed via Makefile commands for both development and production