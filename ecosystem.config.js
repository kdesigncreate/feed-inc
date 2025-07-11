// PM2 Ecosystem Configuration for Feed Inc. Website
// Start all applications: pm2 start ecosystem.config.js
// Start production: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      // Next.js Frontend Application
      name: 'feed-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      // Logging
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Monitoring
      monitor: true,
      // Auto restart on file changes (development only)
      watch: false,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs'
      ]
    },
    {
      // Laravel Queue Worker
      name: 'laravel-queue',
      cwd: './backend',
      script: 'php',
      args: 'artisan queue:work --sleep=3 --tries=3 --max-time=3600 --memory=512',
      instances: 2, // Run 2 queue worker instances
      exec_mode: 'fork',
      env: {
        APP_ENV: 'local'
      },
      env_production: {
        APP_ENV: 'production'
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M',
      // Logging
      log_file: './logs/queue-combined.log',
      out_file: './logs/queue-out.log',
      error_file: './logs/queue-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Cron restart (restart queue workers daily to prevent memory leaks)
      cron_restart: '0 2 * * *', // Restart at 2:00 AM every day
      // Monitoring
      monitor: true,
      watch: false
    },
    {
      // Laravel Scheduler (alternative to cron)
      name: 'laravel-scheduler',
      cwd: './backend',
      script: 'php',
      args: 'artisan schedule:work',
      instances: 1,
      exec_mode: 'fork',
      env: {
        APP_ENV: 'local'
      },
      env_production: {
        APP_ENV: 'production'
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '128M',
      // Logging
      log_file: './logs/scheduler-combined.log',
      out_file: './logs/scheduler-out.log',
      error_file: './logs/scheduler-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Monitoring
      monitor: true,
      watch: false
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/feed-inc.git',
      path: '/var/www/feed-inc',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --prefix frontend && npm run build --prefix frontend && composer install --no-dev --optimize-autoloader --working-dir=backend && php backend/artisan migrate --force && php backend/artisan config:cache && php backend/artisan route:cache && php backend/artisan view:cache && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};