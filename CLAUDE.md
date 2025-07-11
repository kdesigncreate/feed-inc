# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Japanese corporate website for Feed Inc. (株式会社フィード), a promotion and branding company. The project uses a Laravel backend and Next.js frontend architecture.

## Architecture

### Backend (Laravel)
- **Framework**: Laravel 12.0 (PHP 8.2+)
- **Location**: `/backend/`
- **Database**: SQLite (development)
- **Key Features**: Basic Laravel setup with minimal custom code

### Frontend (Next.js)
- **Framework**: Next.js 15.3.5 with App Router
- **Location**: `/frontend/`
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Key Libraries**: Radix UI, Swiper, Axios
- **Architecture**: Japanese corporate website with multiple sections (Company, Services, Cases, Knowledge)

## Development Commands

### Backend Development
```bash
cd backend
# Install dependencies
composer install

# Development server (runs Laravel + queue + logs + vite concurrently)
composer run dev

# Run tests
composer run test

# Code formatting
./vendor/bin/pint
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Key Architecture Patterns

### Frontend Structure
- **Pages**: App Router structure in `src/app/`
- **Components**: Reusable UI components in `src/components/`
- **Types**: TypeScript definitions in `src/types/`
- **Constants**: Business data and configuration in `src/lib/constants.ts`
- **Utilities**: Helper functions in `src/lib/utils.ts`

### Component Architecture
- Components use TypeScript interfaces for props
- Shared UI components (Button, Card, Modal) in `/components/`
- Page-specific components for complex sections (HeroSection, CasesSlider, etc.)
- Consistent use of Next.js Image component for optimized images

### Data Management
- Static data stored in `constants.ts` (company info, navigation, service categories)
- React Context for authentication state management (`AuthContext`)
- Dynamic content managed through Laravel backend API
- Japanese content with proper SEO metadata

### Styling Approach
- Tailwind CSS with custom configuration
- Responsive design with mobile-first approach
- Japanese typography support (Montserrat + Noto Sans JP fonts)
- Hover effects and transitions for interactive elements

## Development Notes

### Frontend Specific
- Uses Japanese content throughout
- Image assets stored in `/public/image/` with organized subdirectories
- Google Tag Manager integration (commented out in layout)
- Accessibility features including skip links
- PDF assets for download functionality

### Backend Specific
- Laravel Sanctum authentication for admin users
- Article management system with CRUD operations
- Uses SQLite for development database
- API endpoints for both public content and authenticated admin operations
- Vite integration for asset compilation
- Standard Laravel testing setup with PHPUnit

## Common Tasks

### Adding New Pages
1. Create new page in `frontend/src/app/[page-name]/page.tsx`
2. Update navigation in `constants.ts` if needed
3. Add corresponding image assets to `/public/image/`

### Modifying Business Data
- Update `frontend/src/lib/constants.ts` for company information, services, etc.
- Business logic is primarily in constants rather than database

### Testing
- Frontend: Use `npm run lint` for code quality
- Backend: Use `composer run test` for Laravel tests
- Both: Check build processes before deployment

## Authentication & Admin System

### Admin Authentication
- **Backend**: Laravel Sanctum token-based authentication
- **Frontend**: React Context (`AuthContext`) for state management
- **Routes**: Admin routes in `/admin/` with authentication protection
- **Components**: `ProtectedRoute` and `AdminRoute` for route protection

### Article Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Categories**: Filterable article categories matching service types
- **Publishing**: Articles can be published/unpublished
- **Search**: Backend search functionality across title and content
- **API Endpoints**: 
  - Public: `GET /api/articles`, `GET /api/articles/{slug}`, `GET /api/categories`
  - Admin: `POST /api/articles`, `PUT /api/articles/{id}`, `DELETE /api/articles/{id}`