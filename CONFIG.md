# Configuration Guide

This document explains all environment variables used in the Project Manager API.

## Environment Variables

### Database Configuration

#### `DB_HOST`
- **Type:** String
- **Default:** `localhost`
- **Description:** MySQL server hostname or IP address
- **Examples:**
  - Local: `localhost` or `127.0.0.1`
  - Remote: `db.example.com` or `192.168.1.100`
  - Docker: `mysql-service`

#### `DB_PORT`
- **Type:** Integer
- **Default:** `3306`
- **Description:** MySQL server port
- **Note:** Standard MySQL port is 3306

#### `DB_NAME`
- **Type:** String
- **Default:** `project_manager`
- **Description:** Database name to use
- **Note:** Database will be created automatically if it doesn't exist

#### `DB_USER`
- **Type:** String
- **Default:** `root`
- **Description:** MySQL username for authentication
- **Examples:**
  - Local dev: `root`
  - Production: `pm_app_user`

#### `DB_PASSWORD`
- **Type:** String
- **Default:** (empty)
- **Description:** MySQL password for the specified user
- **Security:** 
  - Never commit actual passwords to version control
  - Use strong passwords in production
  - Never use empty passwords in production

### Server Configuration

#### `PORT`
- **Type:** Integer
- **Default:** `5000`
- **Description:** Port on which the server listens
- **Examples:**
  - Development: `5000`, `3000`, `8000`
  - Production: `3000`, `8080`
  - Note: Ports under 1024 require root/admin privileges

#### `NODE_ENV`
- **Type:** String
- **Default:** `development`
- **Allowed Values:** `development`, `production`, `staging`
- **Description:** Application environment
- **Effects:**
  - `development`: Detailed logging, auto-reload with nodemon
  - `production`: Minimal logging, optimized performance
  - Affects error handling verbosity

### JWT Configuration

#### `JWT_SECRET`
- **Type:** String
- **Default:** `your_jwt_secret_key_here`
- **Description:** Secret key for signing JWT tokens
- **Security:**
  - MUST be changed for production
  - Use a long, random string (min 32 characters)
  - Example: `openssl rand -base64 32`
  - Should be kept secret and changed regularly

#### `JWT_EXPIRE`
- **Type:** String (Duration format)
- **Default:** `7d`
- **Allowed Values:** 
  - `7d` (7 days)
  - `24h` (24 hours)
  - `1h` (1 hour)
  - `30d` (30 days)
- **Description:** JWT token expiration time
- **Note:** Shorter duration = more secure but more frequent logins

### API Configuration

#### `API_BASE_URL`
- **Type:** String
- **Default:** `http://localhost:5000`
- **Description:** Base URL for API (used in responses/docs)
- **Examples:**
  - Local: `http://localhost:5000`
  - Production: `https://api.projectmanager.com`
  - Staging: `https://staging-api.projectmanager.com`

## Setup Examples

### Development Environment
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_manager
DB_USER=root
DB_PASSWORD=
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
API_BASE_URL=http://localhost:5000
```

### Production Environment
```bash
DB_HOST=db.production.example.com
DB_PORT=3306
DB_NAME=pm_production
DB_USER=pm_app_user
DB_PASSWORD=strong_password_here_generated_randomly
PORT=3000
NODE_ENV=production
JWT_SECRET=very_long_random_secret_key_min_32_chars_generated_with_openssl
JWT_EXPIRE=24h
API_BASE_URL=https://api.projectmanager.com
```

### Docker Environment
```bash
DB_HOST=mysql-service
DB_PORT=3306
DB_NAME=project_manager
DB_USER=pm_user
DB_PASSWORD=docker_password
PORT=5000
NODE_ENV=production
JWT_SECRET=docker_jwt_secret_key
JWT_EXPIRE=7d
API_BASE_URL=http://localhost:5000
```

## Security Best Practices

1. **Never commit `.env` files to version control**
   - Use `.env.example` as template
   - Add `.env` to `.gitignore`

2. **Change `JWT_SECRET` in production**
   - Generate with: `openssl rand -base64 32`
   - Store securely (use secret management tools)
   - Rotate periodically

3. **Use strong database passwords**
   - Min 12 characters, mixed case, numbers, symbols
   - Never reuse passwords
   - Consider using generated passwords

4. **Protect database access**
   - Whitelist IPs that can connect
   - Use private network for database
   - Enable SSL/TLS for connections

5. **Use HTTPS in production**
   - Obtain SSL/TLS certificate
   - Update `API_BASE_URL` to use `https://`
   - Implement HSTS headers

6. **Token expiration**
   - Shorter duration = more secure
   - Balance with user experience
   - Use refresh tokens for longer sessions

## Environment File Creation

### Method 1: Manual
```bash
cp .env.example .env
nano .env
# Edit with your values
```

### Method 2: Script
```bash
#!/bin/bash
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_manager
DB_USER=root
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
API_BASE_URL=http://localhost:5000
EOF
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solutions:**
- Check `DB_HOST` and `DB_PORT`
- Verify MySQL is running
- Check DB_USER has correct password
- Ensure database exists

### JWT Token Invalid
```
Error: Invalid or expired token
```
**Solutions:**
- Check `JWT_SECRET` is same as when token was created
- Verify token hasn't expired (check `JWT_EXPIRE`)
- Don't include "Bearer " in the token, only the token itself

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solutions:**
- Change `PORT` to different number
- Kill process using the port: `lsof -ti :5000 | xargs kill -9`
- Administrator may be required for ports < 1024

## Validation

After setting up `.env`, verify with:
```bash
npm run migrate  # Initialize database
npm start         # Start server
curl http://localhost:5000/health  # Check server
```

All endpoints should now be accessible with proper token authentication.
