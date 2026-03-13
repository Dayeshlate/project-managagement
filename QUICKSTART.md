# Quick Start Guide

Get your Project Manager API running in 5 minutes!

## Prerequisites
- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MySQL** 5.7+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** (comes with Node.js)

## Step 1: Clone and Navigate
```bash
cd backend
```

## Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- sequelize (ORM)
- mysql2 (database driver)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- express-validator (input validation)

## Step 3: Configure Database
```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
```

## Step 4: Initialize Database
```bash
npm run migrate
```

This creates:
- Database named `project_manager`
- 3 tables (users, projects, daily_reports)
- Sample admin user

**Admin Credentials:**
- Email: `admin@projectmanager.com`
- Password: `Admin@123`

## Step 5: Start Server
```bash
npm start
```

You should see:
```
✓ Database connection established
✓ Database models synced
✓ Server running on http://localhost:5000
```

## Step 6: Test the API
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-12T10:00:00.000Z"
}
```

## First API Call: Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@projectmanager.com",
    "password": "Admin@123"
  }'
```

Save the returned `token` for other requests!

## Next Steps

1. **Create a Project** (see TESTING.md)
2. **Add Daily Reports** (see TESTING.md)
3. **Review API Documentation** (see README.md)
4. **Configure Environment** (see CONFIG.md)

## Common Issues

### "Cannot find module 'express'"
```bash
npm install
```

### "Error: connect ECONNREFUSED"
- Start MySQL: `net start MySQL80` (Windows) or `brew services start mysql@5.7` (Mac)
- Verify credentials in `.env`

### "Port 5000 already in use"
```bash
# Change PORT in .env to 5001, 5002, etc.
# OR kill the process using port 5000
```

### "Authentication failed for user 'root'"
- Check MySQL password in `.env`
- Create new user:
  ```sql
  CREATE USER 'pm_user'@'localhost' IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON project_manager.* TO 'pm_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

## Development Mode (Hot Reload)
```bash
npm run dev
```

Server restarts automatically when files change.

## Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── models/          # Sequelize models
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Helpers (JWT, validation)
│   └── index.js         # Main server file
├── migrations/          # Database setup
├── README.md            # Full documentation
├── TESTING.md           # API testing guide
├── CONFIG.md            # Configuration details
└── package.json         # Dependencies
```

## API Endpoints Summary

### Authentication
- `POST /auth/register` – Create account
- `POST /auth/login` – Get JWT token

### Projects (require token)
- `POST /projects` – Create project
- `GET /projects` – List all projects
- `GET /projects/:id` – Get project details
- `PUT /projects/:id` – Update project
- `DELETE /projects/:id` – Delete project

### Daily Reports (require token)
- `POST /projects/:id/dpr` – Create report
- `GET /projects/:id/dpr` – List reports

## Next: Testing
See **TESTING.md** for complete test scenarios with expected responses.

## Need Help?
1. Check the error message for clues
2. Review TESTING.md for examples
3. Check CONFIG.md for configuration issues
4. Verify MySQL is running and credentials are correct
5. Check NODE_ENV matches expected behavior
