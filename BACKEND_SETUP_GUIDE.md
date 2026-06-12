# Backend Setup and Deployment Guide

This guide will help you set up and deploy the powerful backend server for Bilisa Archive.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn
- Basic knowledge of command line

## Quick Start

### 1. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

#### Create Database
```bash
# Start PostgreSQL service (if needed)
# Windows: Start PostgreSQL service from Services
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
createdb bilisa_archive

# Or using psql
psql -U postgres
CREATE DATABASE bilisa_archive;
\q
```

### 2. Backend Server Setup

#### Navigate to Server Directory
```bash
cd server
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bilisa_archive
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=generate_a_strong_random_secret_here
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

#### Run Database Migration
```bash
npm run migrate
```

This will create all necessary tables and indexes.

#### Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 3. Frontend Configuration

#### Update Frontend Environment
```bash
# In the root directory
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend
```bash
# In the root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Production Deployment

### 1. Server Preparation

#### Update Environment Variables
```env
NODE_ENV=production
PORT=5000
# Use strong JWT secret
JWT_SECRET=your_production_secret_here
# Update CORS to production domain
CORS_ORIGIN=https://your-domain.com
```

#### Build and Start
```bash
npm install --production
npm start
```

### 2. Using PM2 (Process Manager)

#### Install PM2
```bash
npm install -g pm2
```

#### Start Server with PM2
```bash
pm2 start server.js --name bilisa-backend
pm2 save
pm2 startup
```

#### PM2 Commands
```bash
pm2 list              # List all processes
pm2 logs bilisa-backend  # View logs
pm2 restart bilisa-backend  # Restart server
pm2 stop bilisa-backend     # Stop server
pm2 delete bilisa-backend   # Delete process
```

### 3. Nginx Reverse Proxy (Optional but Recommended)

#### Install Nginx
```bash
# Ubuntu/Debian
sudo apt-get install nginx

# Mac
brew install nginx

# Windows
# Download from nginx.org
```

#### Configure Nginx
Create `/etc/nginx/sites-available/bilisa-archive`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/bilisa-archive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL/TLS with Let's Encrypt

#### Install Certbot
```bash
# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx

# Mac
brew install certbot

# Windows
# Download from certbot.eff.org
```

#### Obtain Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

#### Auto-renewal
Certbot automatically sets up auto-renewal. Verify with:
```bash
sudo certbot renew --dry-run
```

## Database Management

### Backup Database
```bash
pg_dump -U postgres bilisa_archive > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U postgres bilisa_archive < backup_20240101.sql
```

### Access Database
```bash
psql -U postgres bilisa_archive
```

### Useful SQL Commands
```sql
-- View all tables
\dt

-- View table structure
\d notes

-- Count notes
SELECT COUNT(*) FROM notes;

-- View recent notes
SELECT * FROM notes ORDER BY created_at DESC LIMIT 10;

-- View user activities
SELECT * FROM user_activities ORDER BY created_at DESC LIMIT 20;
```

## Monitoring and Logging

### View Server Logs
```bash
# With PM2
pm2 logs bilisa-backend

# Direct file
tail -f logs/combined.log
```

### Monitor Database Performance
```bash
# Connect to database
psql -U postgres bilisa_archive

# View active connections
SELECT count(*) FROM pg_stat_activity;

# View slow queries
SELECT query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac/Linux: sudo service postgresql status

# Test connection
psql -U postgres -h localhost -d bilisa_archive

# Check PostgreSQL logs
# Linux: /var/log/postgresql/
# Mac: /usr/local/var/log/postgres/
```

### Port Already in Use
```bash
# Find process using port 5000
# Linux/Mac
lsof -i :5000

# Windows
netstat -ano | findstr :5000

# Kill process
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### Permission Issues
```bash
# Fix upload directory permissions
chmod 755 server/uploads
```

### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database and JWT secret
3. **Enable HTTPS** in production
4. **Keep dependencies updated** with `npm audit fix`
5. **Use firewall rules** to restrict database access
6. **Regular backups** of database and uploads
7. **Monitor logs** for suspicious activity
8. **Rate limiting** is enabled by default
9. **CORS** is configured to your domain only

## Performance Optimization

### Database Optimization
```sql
-- Analyze tables for query optimization
ANALYZE notes;
ANALYZE users;

-- Reindex tables
REINDEX TABLE notes;
REINDEX TABLE users;

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

### Enable Connection Pooling
The backend already uses connection pooling. Adjust pool size in `src/database/config.js`:
```javascript
max: 20, // Increase for high traffic
```

### Enable Caching (Optional)
Add Redis for session caching and query caching.

## Scaling

### Horizontal Scaling
1. Deploy multiple server instances behind a load balancer
2. Use shared database (PostgreSQL)
3. Use Redis for session storage
4. Use CDN for static assets

### Vertical Scaling
1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Enable database caching
4. Use SSD storage

## Support

For issues and questions:
1. Check the server logs
2. Review the API documentation in `server/README.md`
3. Check database connection and configuration
4. Verify environment variables are set correctly

## Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Configure and start backend server
3. ✅ Update frontend configuration
4. ✅ Test the application
5. ✅ Deploy to production
6. ✅ Set up monitoring and backups
7. ✅ Configure SSL/TLS
8. ✅ Set up CI/CD pipeline (optional)

Your powerful backend is now ready! 🚀
