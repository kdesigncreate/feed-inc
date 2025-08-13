#!/bin/bash

# Let's Encrypt SSL certificate renewal script
# This script should be run via cron

echo "$(date): Starting SSL certificate renewal check..."

# Navigate to project directory
cd /home/kenta/feed-inc

# Check if certificates need renewal and renew if necessary
sudo docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/www/certbot:/var/www/certbot \
  certbot/certbot renew --quiet

# Check renewal status
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal check completed successfully"
    
    # Reload nginx to pick up new certificates
    sudo docker exec feed-nginx nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo "$(date): Nginx reloaded successfully"
    else
        echo "$(date): ERROR - Failed to reload nginx"
        exit 1
    fi
else
    echo "$(date): ERROR - Certificate renewal failed"
    exit 1
fi

echo "$(date): SSL renewal process completed"