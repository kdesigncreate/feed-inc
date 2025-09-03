FROM php:8.2-fpm

# セキュリティ: 非rootユーザーを作成
RUN groupadd -r appgroup && useradd -r -g appgroup -d /var/www/html -s /sbin/nologin appuser

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client \
    default-libmysqlclient-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Install PHP extensions for MySQL
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Configure PHP-FPM to listen on all interfaces for Docker containers
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY backend/composer.json backend/composer.lock ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader --no-dev

# Copy Laravel application
COPY backend/ .

# Complete composer install with clean package discovery
RUN rm -rf bootstrap/cache/* \
    && composer dump-autoload --optimize --no-dev --no-scripts

# Create directories and set permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R appuser:appgroup /var/www/html \
    && chmod -R 750 storage bootstrap/cache \
    && chmod -R 644 /var/www/html \
    && chmod -R 755 /var/www/html/public

# セキュリティ設定: 機密ファイルの権限を厳格化
RUN chmod 600 .env* 2>/dev/null || true \
    && find /var/www/html -name "*.log" -exec chmod 640 {} \; \
    && find /var/www/html -type d -exec chmod 750 {} \;

# Copy simple entrypoint script
COPY docker-entrypoint-simple.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# セキュリティ: 非rootユーザーに切り替え
USER appuser

# Expose port
EXPOSE 9000

# Start with entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]