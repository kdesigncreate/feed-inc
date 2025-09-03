#!/bin/bash
cd /var/www/html

# Wait for database to be ready
while ! mysqladmin ping -h mysql -u root -p"$MYSQL_ROOT_PASSWORD" --silent; do
    echo "Waiting for database to be ready..."
    sleep 2
done

echo "Database is ready, running migrations..."

# Run database migrations
php artisan migrate --force

# Seed database if needed
php artisan db:seed --force

# Clear and cache configurations
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

php artisan config:cache
php artisan route:cache

echo "Database initialization completed."