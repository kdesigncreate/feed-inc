#!/bin/bash

# Feed Inc. Production Deployment Script
# Usage: ./deploy.sh [branch]
# Default branch: main

set -e  # Exit on any error

# Configuration
DEPLOY_BRANCH=${1:-main}
APP_DIR="/var/www/feed-inc"
BACKUP_DIR="/var/backups/feed-inc"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Run as the deploy user."
fi

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    error "Application directory $APP_DIR does not exist."
fi

log "Starting deployment of Feed Inc. website..."
log "Branch: $DEPLOY_BRANCH"
log "Timestamp: $TIMESTAMP"

# Change to application directory
cd $APP_DIR

# Create backup directory if it doesn't exist
sudo mkdir -p $BACKUP_DIR

# 1. Backup current application
log "Creating backup..."
sudo tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='vendor' \
    --exclude='.git' \
    --exclude='backend/storage/logs' \
    --exclude='frontend/.next' \
    . || error "Failed to create backup"

# 2. Put application in maintenance mode
log "Enabling maintenance mode..."
cd backend
php artisan down --message="Deployment in progress. Please try again in a few minutes." || warning "Could not enable maintenance mode"

# 3. Update code
log "Updating code from Git..."
cd $APP_DIR
git fetch origin || error "Failed to fetch from origin"
git checkout $DEPLOY_BRANCH || error "Failed to checkout branch $DEPLOY_BRANCH"
git pull origin $DEPLOY_BRANCH || error "Failed to pull latest changes"

# 4. Update backend dependencies
log "Updating backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader --no-interaction || error "Failed to install backend dependencies"

# 5. Update frontend dependencies
log "Updating frontend dependencies..."
cd ../frontend
npm ci --production || error "Failed to install frontend dependencies"

# 6. Run database migrations
log "Running database migrations..."
cd ../backend
php artisan migrate --force || error "Database migration failed"

# 7. Clear and cache Laravel configurations
log "Optimizing Laravel..."
php artisan config:cache || error "Failed to cache config"
php artisan route:cache || error "Failed to cache routes"
php artisan view:cache || error "Failed to cache views"

# 8. Build frontend
log "Building frontend..."
cd ../frontend
npm run build || error "Frontend build failed"

# 9. Set correct permissions
log "Setting permissions..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR
sudo chmod -R 775 $APP_DIR/backend/storage $APP_DIR/backend/bootstrap/cache

# 10. Restart PM2 processes
log "Restarting PM2 processes..."
pm2 restart ecosystem.config.js --env production || error "Failed to restart PM2 processes"

# 11. Reload Nginx
log "Reloading Nginx..."
sudo systemctl reload nginx || error "Failed to reload Nginx"

# 12. Disable maintenance mode
log "Disabling maintenance mode..."
cd backend
php artisan up || warning "Could not disable maintenance mode"

# 13. Verify deployment
log "Verifying deployment..."
sleep 5

# Check if PM2 processes are running
PM2_STATUS=$(pm2 status --no-colors | grep -E "feed-frontend|laravel-queue" | grep -c "online" || true)
if [ "$PM2_STATUS" -lt 2 ]; then
    warning "Some PM2 processes may not be running properly. Check with 'pm2 status'"
fi

# Check if Nginx is running
if ! sudo systemctl is-active --quiet nginx; then
    error "Nginx is not running!"
fi

# Check if the website is responding
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")
if [ "$FRONTEND_CHECK" != "200" ]; then
    warning "Frontend may not be responding properly (HTTP $FRONTEND_CHECK)"
fi

log "Deployment completed successfully!"
log "Backup created: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
log "To rollback if needed, run: ./rollback.sh $TIMESTAMP"

# Show status
log "Current status:"
pm2 status
sudo systemctl status nginx --no-pager -l