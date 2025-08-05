#!/bin/bash
set -e

# Function for logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Laravel container initialization..."

# Wait for database directory to be mounted
if [ ! -d "/var/www/html/database" ]; then
    log "Creating database directory..."
    mkdir -p /var/www/html/database
fi

# Create SQLite database if it doesn't exist
if [ ! -f "/var/www/html/database/database.sqlite" ]; then
    log "Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
    chmod 664 /var/www/html/database/database.sqlite
fi

# Set proper permissions
log "Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Clear bootstrap cache to avoid dev dependency issues
log "Clearing bootstrap cache..."
rm -rf /var/www/html/bootstrap/cache/*

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:dGVzdF9rZXlfZm9yX2RlbW9fcHVycG9zZXNfb25seQ==" ]; then
    log "Generating application key..."
    php artisan key:generate --force
fi

# Run migrations
log "Running database migrations..."
php artisan migrate --force

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    log "Optimizing for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Create storage link if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    log "Creating storage symlink..."
    php artisan storage:link
fi

log "Laravel container initialization completed!"

# Execute the main command
exec "$@"