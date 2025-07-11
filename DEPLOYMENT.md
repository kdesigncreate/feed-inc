# Feed Inc. Production Deployment Guide

This document outlines the steps to deploy the Feed Inc. website to Xserver VPS with Ubuntu and Nginx.

## Prerequisites

- Ubuntu 20.04+ server
- Node.js 18+ and npm
- PHP 8.2+
- Composer
- MySQL 8.0+
- Nginx
- PM2 (`npm install -g pm2`)
- SSL Certificate

## Configuration Files Created

### 1. Environment Variables

#### Backend: `/backend/.env.production`
- Production environment settings for Laravel
- **IMPORTANT**: Update the following before deployment:
  - `APP_URL`: Your actual domain
  - `DB_*`: Your production database credentials
  - `MAIL_*`: Your SMTP settings
  - `SESSION_DOMAIN`: Your domain
  - `SANCTUM_STATEFUL_DOMAINS`: Your domain(s)

#### Frontend: `/frontend/.env.production`
- Production environment settings for Next.js
- **IMPORTANT**: Update `NEXT_PUBLIC_API_URL` to your actual domain

### 2. Nginx Configuration: `/nginx.conf`
- Complete Nginx server configuration
- Handles SSL termination, static files, and proxying
- **IMPORTANT**: Update the following before deployment:
  - `server_name`: Your actual domain(s)
  - `ssl_certificate` and `ssl_certificate_key`: Your SSL certificate paths
  - All instances of "your-domain.com"

### 3. PM2 Configuration: `/ecosystem.config.js`
- Process management for Next.js frontend and Laravel queue workers
- Includes logging, monitoring, and restart policies

### 4. Laravel CORS Configuration
- Updated `/backend/config/cors.php` to include production domains
- **IMPORTANT**: Update allowed origins with your actual domain

## Deployment Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx mysql-server php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-xml php8.2-zip php8.2-mbstring

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -e "CREATE DATABASE feed_inc_prod;"
sudo mysql -e "CREATE USER 'feed_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';"
sudo mysql -e "GRANT ALL PRIVILEGES ON feed_inc_prod.* TO 'feed_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 3. Application Deployment

```bash
# Clone repository (or upload files)
git clone <your-repo> /var/www/feed-inc
cd /var/www/feed-inc

# Set permissions
sudo chown -R www-data:www-data /var/www/feed-inc
sudo chmod -R 755 /var/www/feed-inc

# Backend setup
cd backend
composer install --no-dev --optimize-autoloader
cp .env.production .env
# Edit .env with your actual values
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink
php artisan storage:link

# Set proper permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Frontend setup
cd ../frontend
npm ci --production
# Edit .env.production with your actual values
cp .env.production .env.local
npm run build

# Create logs directory
mkdir -p ../logs
sudo chown -R www-data:www-data ../logs
```

### 4. Nginx Configuration

```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/feed-inc.com

# Edit the configuration file with your actual domain and SSL paths
sudo nano /etc/nginx/sites-available/feed-inc.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/feed-inc.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Restart Nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate Setup

Using Let's Encrypt (recommended):

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already set up by Certbot)
sudo crontab -l # Check if renewal cron job exists
```

### 6. Start Applications with PM2

```bash
# Start all applications
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command output by PM2
```

### 7. Configure PHP-FPM (if needed)

```bash
# Edit PHP-FPM configuration for better performance
sudo nano /etc/php/8.2/fpm/pool.d/www.conf

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

## Post-Deployment Checklist

- [ ] Domain DNS points to server IP
- [ ] SSL certificate is installed and working
- [ ] All environment variables are set correctly
- [ ] Database connection is working
- [ ] Frontend can communicate with backend API
- [ ] PM2 processes are running (`pm2 status`)
- [ ] Nginx is serving requests properly
- [ ] Error logs are being written properly
- [ ] Admin login functionality works
- [ ] Article creation/editing works
- [ ] Public website loads correctly

## Monitoring and Maintenance

### Logs Locations

- Nginx: `/var/log/nginx/feed-inc.access.log` and `/var/log/nginx/feed-inc.error.log`
- PM2: `./logs/` directory
- Laravel: `backend/storage/logs/`

### Useful Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs feed-frontend
pm2 logs laravel-queue

# Restart applications
pm2 restart feed-frontend
pm2 restart laravel-queue

# Nginx operations
sudo systemctl status nginx
sudo systemctl reload nginx

# View system logs
sudo journalctl -u nginx
```

### Updates and Maintenance

```bash
# Update application code
cd /var/www/feed-inc
git pull origin main

# Update backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update frontend
cd ../frontend
npm ci --production
npm run build

# Restart applications
pm2 restart all
```

## Security Considerations

- Keep all software packages updated
- Use strong passwords for database and system users
- Regularly monitor logs for suspicious activity
- Consider setting up a firewall (ufw)
- Backup database regularly
- Monitor SSL certificate expiration

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Check if PM2 processes are running and listening on correct ports
2. **403 Forbidden**: Check file permissions and Nginx configuration
3. **Database Connection Error**: Verify database credentials in `.env`
4. **CORS Errors**: Ensure production domain is added to CORS configuration
5. **SSL Issues**: Check certificate paths in Nginx configuration

### Emergency Contacts

- Server logs: `sudo journalctl -f`
- Application logs: `pm2 logs`
- Nginx status: `sudo systemctl status nginx`