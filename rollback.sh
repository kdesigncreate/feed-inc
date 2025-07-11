#!/bin/bash

# Feed Inc. Rollback Script
# Usage: ./rollback.sh [backup_timestamp]
# Example: ./rollback.sh 20241210_143000

set -e  # Exit on any error

# Configuration
BACKUP_TIMESTAMP=$1
APP_DIR="/var/www/feed-inc"
BACKUP_DIR="/var/backups/feed-inc"

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

# Check if backup timestamp is provided
if [ -z "$BACKUP_TIMESTAMP" ]; then
    echo "Available backups:"
    ls -la $BACKUP_DIR/backup_*.tar.gz 2>/dev/null || echo "No backups found"
    echo ""
    error "Please provide a backup timestamp. Usage: ./rollback.sh [timestamp]"
fi

# Check if backup file exists
BACKUP_FILE="$BACKUP_DIR/backup_$BACKUP_TIMESTAMP.tar.gz"
if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file $BACKUP_FILE does not exist"
fi

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Run as the deploy user."
fi

log "Starting rollback to backup: $BACKUP_TIMESTAMP"

# Confirmation prompt
read -p "Are you sure you want to rollback? This will overwrite the current application. [y/N]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Rollback cancelled"
    exit 0
fi

# 1. Enable maintenance mode
log "Enabling maintenance mode..."
cd $APP_DIR/backend
php artisan down --message="Rollback in progress. Please try again in a few minutes." || warning "Could not enable maintenance mode"

# 2. Stop PM2 processes
log "Stopping PM2 processes..."
pm2 stop ecosystem.config.js || warning "Could not stop PM2 processes"

# 3. Create backup of current state before rollback
log "Creating backup of current state..."
CURRENT_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
sudo tar -czf "$BACKUP_DIR/pre_rollback_$CURRENT_TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='vendor' \
    --exclude='.git' \
    --exclude='backend/storage/logs' \
    --exclude='frontend/.next' \
    -C $APP_DIR . || warning "Could not backup current state"

# 4. Extract backup
log "Extracting backup..."
cd $APP_DIR
sudo tar -xzf $BACKUP_FILE || error "Failed to extract backup"

# 5. Restore dependencies
log "Restoring backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader --no-interaction || error "Failed to install backend dependencies"

log "Restoring frontend dependencies..."
cd ../frontend
npm ci --production || error "Failed to install frontend dependencies"

# 6. Build frontend
log "Building frontend..."
npm run build || error "Frontend build failed"

# 7. Restore Laravel cache
log "Restoring Laravel cache..."
cd ../backend
php artisan config:cache || warning "Failed to cache config"
php artisan route:cache || warning "Failed to cache routes"
php artisan view:cache || warning "Failed to cache views"

# 8. Set correct permissions
log "Setting permissions..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR
sudo chmod -R 775 $APP_DIR/backend/storage $APP_DIR/backend/bootstrap/cache

# 9. Restart PM2 processes
log "Restarting PM2 processes..."
pm2 restart ecosystem.config.js --env production || error "Failed to restart PM2 processes"

# 10. Reload Nginx
log "Reloading Nginx..."
sudo systemctl reload nginx || warning "Failed to reload Nginx"

# 11. Disable maintenance mode
log "Disabling maintenance mode..."
cd backend
php artisan up || warning "Could not disable maintenance mode"

# 12. Verify rollback
log "Verifying rollback..."
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

log "Rollback completed successfully!"
log "Restored from backup: $BACKUP_FILE"
log "Pre-rollback backup created: $BACKUP_DIR/pre_rollback_$CURRENT_TIMESTAMP.tar.gz"

# Show status
log "Current status:"
pm2 status