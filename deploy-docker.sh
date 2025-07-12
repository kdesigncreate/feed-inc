#!/bin/bash

# Feed Inc. Docker Production Deployment Script for XserverVPS
# Usage: ./deploy-docker.sh
# This script sets up the entire application from scratch on Ubuntu

set -e  # Exit on any error

# Configuration
APP_NAME="feed-inc"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DOMAIN="designcreateform.com"
EMAIL="admin@designcreateform.com"  # Change this to your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root for initial setup. Use: sudo ./deploy-docker.sh"
fi

log "Starting Feed Inc. Docker deployment for XserverVPS..."
log "Domain: $DOMAIN"
log "Timestamp: $TIMESTAMP"

# 1. System Update
log "Updating system packages..."
apt update && apt upgrade -y

# 2. Install Docker if not installed
if ! command -v docker &> /dev/null; then
    log "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
else
    info "Docker is already installed"
fi

# 3. Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    log "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    info "Docker Compose is already installed"
fi

# 4. Install additional tools
log "Installing additional tools..."
apt install -y git curl wget unzip certbot python3-certbot-nginx

# 5. Create application directory
log "Setting up application directory..."
mkdir -p $APP_DIR
mkdir -p $BACKUP_DIR
mkdir -p $APP_DIR/ssl
mkdir -p $APP_DIR/logs

# 6. Clone repository (if not exists)
if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository..."
    cd /tmp
    if [ -d "$APP_NAME" ]; then
        rm -rf $APP_NAME
    fi
    # Replace with your actual repository URL
    # git clone https://github.com/your-username/feed-inc.git $APP_NAME
    # For now, copy from current directory if available
    if [ -d "/home/*/feed-inc" ]; then
        cp -r /home/*/feed-inc/* $APP_DIR/
    else
        error "Repository not found. Please clone your repository to $APP_DIR manually"
    fi
else
    info "Repository already exists"
fi

cd $APP_DIR

# 7. Set up environment files
log "Creating environment files..."

# Laravel environment
cat > backend/.env << EOF
APP_NAME="Feed Inc."
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=Asia/Tokyo
APP_URL=https://$DOMAIN

APP_LOCALE=ja
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=ja_JP

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=file
CACHE_PREFIX=
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=$DOMAIN

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=$DOMAIN,www.$DOMAIN
SESSION_DOMAIN=.$DOMAIN
SPA_URL=https://$DOMAIN

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error
EOF

# Next.js environment
cat > frontend/.env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_SITE_NAME="Feed Inc."
NEXT_PUBLIC_SITE_DESCRIPTION="株式会社フィード - プロモーション・ブランディング会社"
EOF

# 8. Generate Laravel App Key
log "Generating Laravel application key..."
cd backend
# Generate a random base64 key
APP_KEY=$(openssl rand -base64 32)
sed -i "s|APP_KEY=|APP_KEY=base64:$APP_KEY|" .env
cd ..

# 9. Update Nginx configuration
log "Updating Nginx configuration..."
sed -i "s|designcreateform.com|$DOMAIN|g" nginx.conf
sed -i "s|www.designcreateform.com|www.$DOMAIN|g" nginx.conf
sed -i "s|ssl_certificate /path/to/your/ssl/certificate.crt;|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|" nginx.conf
sed -i "s|ssl_certificate_key /path/to/your/ssl/private.key;|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|" nginx.conf

# 10. Build and start Docker containers
log "Building and starting Docker containers..."
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

# Wait for containers to be ready
log "Waiting for containers to be ready..."
sleep 30

# 11. Check container status
log "Checking container status..."
docker-compose ps

# 12. Set up SSL certificate
log "Setting up SSL certificate with Let's Encrypt..."

# Stop nginx temporarily
docker-compose stop nginx

# Get SSL certificate
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Start nginx again
docker-compose start nginx

# 13. Set up automatic certificate renewal
log "Setting up automatic SSL certificate renewal..."
cat > /etc/cron.d/certbot-renewal << EOF
# Renew SSL certificates automatically
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "cd $APP_DIR && docker-compose restart nginx"
EOF

# 14. Set up log rotation
log "Setting up log rotation..."
cat > /etc/logrotate.d/feed-inc << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        cd $APP_DIR && docker-compose restart nginx
    endscript
}
EOF

# 15. Create backup script
log "Creating backup script..."
cat > $APP_DIR/backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/feed-inc"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/feed-inc"

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T laravel cp /var/www/html/database/database.sqlite /tmp/backup.sqlite
docker cp $(docker-compose ps -q laravel):/tmp/backup.sqlite $BACKUP_DIR/database_$TIMESTAMP.sqlite

# Backup uploaded files
docker-compose exec -T laravel tar -czf /tmp/storage_backup.tar.gz -C /var/www/html storage/app/public
docker cp $(docker-compose ps -q laravel):/tmp/storage_backup.tar.gz $BACKUP_DIR/storage_$TIMESTAMP.tar.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "database_*.sqlite" -mtime +7 -delete
find $BACKUP_DIR -name "storage_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x $APP_DIR/backup.sh

# 16. Set up daily backup cron
log "Setting up daily backup..."
cat > /etc/cron.d/feed-inc-backup << EOF
# Daily backup at 2 AM
0 2 * * * root cd $APP_DIR && ./backup.sh >> /var/log/feed-inc-backup.log 2>&1
EOF

# 17. Set up firewall
log "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# 18. Final health check
log "Performing final health check..."
sleep 10

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    warning "Some containers may not be running properly"
    docker-compose ps
fi

# Check if website is accessible
if curl -f -s http://localhost/health > /dev/null; then
    info "Health check passed"
else
    warning "Health check failed - application may not be fully ready yet"
fi

# 19. Display final information
log "Deployment completed successfully!"
echo
echo -e "${GREEN}=== Deployment Summary ===${NC}"
echo -e "Domain: https://$DOMAIN"
echo -e "Application directory: $APP_DIR"
echo -e "Backup directory: $BACKUP_DIR"
echo -e "Logs directory: $APP_DIR/logs"
echo
echo -e "${BLUE}=== Useful Commands ===${NC}"
echo -e "Check containers: cd $APP_DIR && docker-compose ps"
echo -e "View logs: cd $APP_DIR && docker-compose logs -f"
echo -e "Restart application: cd $APP_DIR && docker-compose restart"
echo -e "Update application: cd $APP_DIR && git pull && docker-compose up -d --build"
echo -e "Create backup: cd $APP_DIR && ./backup.sh"
echo
echo -e "${YELLOW}=== Next Steps ===${NC}"
echo -e "1. Update DNS records to point $DOMAIN to this server"
echo -e "2. Test the website: https://$DOMAIN"
echo -e "3. Configure admin user in Laravel"
echo -e "4. Monitor logs: tail -f $APP_DIR/logs/*.log"
echo

log "Feed Inc. deployment completed successfully!"