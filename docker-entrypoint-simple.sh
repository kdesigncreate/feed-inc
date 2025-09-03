#!/bin/bash
set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting simplified Laravel container..."

# Set permissions
chown -R appuser:appgroup /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

# Start PHP-FPM immediately
log "Starting PHP-FPM..."
php-fpm -D

log "PHP-FPM started successfully!"

# Keep container running
exec "$@"