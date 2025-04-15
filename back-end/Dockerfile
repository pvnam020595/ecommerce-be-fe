FROM php:8.3-fpm

RUN apt-get clean
RUN apt-get update && apt-get install -y sudo \
        zlib1g-dev libicu-dev g++ \
        libjpeg62-turbo-dev \
        libzip-dev \
        libpng-dev \
        libwebp-dev \
        libfreetype6-dev \
    	libxml2-dev \
        libglib2.0-0 \
        libnss3 \
        libgconf-2-4 \
        libfontconfig1 \
        libx11-xcb1 \
    	git \
    	zip \
    	unzip \
    && docker-php-ext-install pdo_mysql \
    && docker-php-ext-enable pdo_mysql \
    && docker-php-ext-configure gd --with-webp=/usr/include/webp --with-jpeg=/usr/include --with-freetype=/usr/include/freetype2/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl
    # && pecl install xdebug-3.3.2 \
    # && docker-php-ext-enable xdebug

# PHP.ini
COPY ./docker_files/php-fpm/php.ini /usr/local/etc/php/conf.d/

# # Install Redis
# RUN pecl install redis


# Install NodeJs
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# # Install Google Chrome Stable
# RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-keyring.gpg && \
# echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
#     apt-get update && \
#     apt-get install -y google-chrome-stable

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Set working directory
WORKDIR /var/www/html

# # # User ID get from .env file order export 
# ARG uid=1000 
# # # User ID get from .env file order export 
# ARG gid=1000

# RUN usermod -u 1000 root \
#     && groupmod -g 1000 root \
#     && chown -R root:root /var/www/html

# # Give www-data user sudo privileges
# RUN echo 'www-data ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
COPY --chown=root:root . /var/www/html
RUN chown -R root:root /var/www/html

# Copy entrypoint.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

# RUN sudo chmod -R 775 /var/www/html/

USER root

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port
EXPOSE 9000