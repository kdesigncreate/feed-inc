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

# Skip SQLite creation - using MySQL instead
log "Skipping SQLite creation - using MySQL database..."

# Set proper permissions with security focus
log "Setting secure permissions..."
# Skip chown operations to avoid Docker permission issues
# chown -R appuser:appgroup /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 750 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database 2>/dev/null || true
chmod 600 /var/www/html/database/database.sqlite 2>/dev/null || true

# Clear bootstrap cache to avoid dev dependency issues
log "Clearing bootstrap cache..."
rm -rf /var/www/html/bootstrap/cache/*

APP_KEY_VAL=$(printenv APP_KEY || true)
if [ -z "$APP_KEY_VAL" ]; then
    log "ERROR: APP_KEY environment variable is not set!"
    log "Please generate a new key using: docker exec <container> php artisan key:generate --show"
    log "Then set APP_KEY in your environment configuration."
    exit 1
fi

# デフォルト・危険なキーパターンの検証
# 長さチェック（32バイト = 44文字のbase64）
if [ ${#APP_KEY_VAL} -lt 50 ]; then
    log "ERROR: APP_KEY appears to be too short for secure use!"
    log "Please generate a proper Laravel application key."
    exit 1
fi

# base64形式チェック
if ! echo "$APP_KEY_VAL" | grep -q "^base64:"; then
    log "ERROR: APP_KEY must be in base64: format!"
    log "Please generate a new key using: php artisan key:generate"
    exit 1
fi

# 既知の弱いパターンのチェック（実際のキーは含めない）
if echo "$APP_KEY_VAL" | grep -qE "base64:(dGVzdA|VGVzdA|dGVtcA|VGVtcA)"; then
    log "ERROR: APP_KEY appears to contain test/demo patterns!"
    log "Please generate a new secure key for production use."
    exit 1
fi

log "APP_KEY validation passed."

# Run migrations
log "Running database migrations..."
php artisan migrate --force

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    log "Clearing existing caches first..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear
    
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