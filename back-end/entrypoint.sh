#!/bin/sh
echo "Starting entrypoint.sh..."

if [ ! -f /var/www/html/.env ]; then
    echo "Creating .env file..."
    cp /var/www/html/.env.example /var/www/html/.env
    php artisan key:generate
fi
# Install Composer dependencies
composer install

# Cài NPM dependencies
npm install --cache /tmp/npm-cache

exec "php-fpm"
