# Project Manager REST API

A comprehensive REST API for managing projects and daily progress reports using Node.js, Express, MySQL, and Sequelize.

## Quick Start

### Prerequisites
- Node.js 14+
- MySQL 5.7+
- npm

### Installation

1. **Clone/Extract the project**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=project_manager
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_very_secret_key_change_in_production
   PORT=5000
   ```

4. **Initialize database**
   ```bash
   npm run migrate
   ```
   This creates tables and inserts a sample admin user.

5. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
All endpoints except `/auth/register` and `/auth/login` require a JWT token:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "worker"
  }
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "worker"
  }
}
```

**Sample Admin Login:**
- Email: `admin@projectmanager.com`
- Password: `Admin@123`

---

### Projects

#### 3. Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "budget": 50000,
  "location": "Office"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "projectId": 1,
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Redesign company website",
    "start_date": "2024-01-15",
    "end_date": "2024-03-15",
    "budget": "50000.00",
    "location": "Office",
    "status": "planned",
    "created_by": 1,
    "created_at": "2024-01-10T10:00:00.000Z",
    "updated_at": "2024-01-10T10:00:00.000Z"
  }
}
```

**Access Control:** Only `admin` and `manager` roles can create projects.

#### 4. List All Projects
```
GET /projects?status=active&limit=10&offset=0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Website Redesign",
      "status": "active",
      "start_date": "2024-01-15",
      "end_date": "2024-03-15",
      "creator": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

**Query Parameters:**
- `status` (optional): Filter by status (`planned`, `active`, `completed`)
- `limit` (default: 10): Number of results
- `offset` (default: 0): Pagination offset

#### 5. Get Project Details
```
GET /projects/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Redesign company website",
    "start_date": "2024-01-15",
    "end_date": "2024-03-15",
    "status": "active",
    "creator": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@projectmanager.com"
    },
    "dailyReports": []
  }
}
```

#### 6. Update Project
```
PUT /projects/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign v2",
  "status": "completed",
  "endDate": "2024-04-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": 1,
    "name": "Website Redesign v2",
    "status": "completed"
  }
}
```

**Access Control:** Only project creator or `admin` can update.

#### 7. Delete Project
```
DELETE /projects/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Access Control:** Only `admin` role can delete.

---

### Daily Progress Reports (DPR)

#### 8. Create Daily Report
```
POST /projects/1/dpr
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "work_description": "Completed homepage design mockups",
  "weather": "Sunny",
  "worker_count": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Daily report created successfully",
  "dprId": 1,
  "data": {
    "id": 1,
    "project_id": 1,
    "user_id": 2,
    "date": "2024-01-15",
    "work_description": "Completed homepage design mockups",
    "weather": "Sunny",
    "worker_count": 5,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

#### 9. List Daily Reports
```
GET /projects/1/dpr?date=2024-01-15
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Daily reports retrieved successfully",
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "user_id": 2,
      "date": "2024-01-15",
      "work_description": "Completed homepage design mockups",
      "weather": "Sunny",
      "worker_count": 5,
      "user": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Query Parameters:**
- `date` (optional): Filter by specific date (YYYY-MM-DD)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Data Model

### Users
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary Key |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Unique, Required |
| password_hash | VARCHAR(255) | Hashed with bcrypt |
| phone | VARCHAR(20) | Optional |
| role | ENUM | admin, manager, worker |
| created_at | TIMESTAMP | Auto-set |

### Projects
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary Key |
| name | VARCHAR(255) | Required |
| description | TEXT | Optional |
| start_date | DATE | Required |
| end_date | DATE | Required |
| budget | DECIMAL(15,2) | Optional |
| location | VARCHAR(255) | Optional |
| status | ENUM | planned, active, completed |
| created_by | INT | FK to users.id |
| created_at | TIMESTAMP | Auto-set |

### Daily Reports
| Field | Type | Notes |
|-------|------|-------|
| id | INT | Primary Key |
| project_id | INT | FK to projects.id |
| user_id | INT | FK to users.id |
| date | DATE | Required |
| work_description | TEXT | Required |
| weather | VARCHAR(100) | Optional |
| worker_count | INT | Default: 1 |
| created_at | TIMESTAMP | Auto-set |

---

## Role-Based Access Control

| Operation | Admin | Manager | Worker |
|-----------|-------|---------|--------|
| Create Project | ✓ | ✓ | ✗ |
| Update Project | ✓ | ✓* | ✗ |
| Delete Project | ✓ | ✗ | ✗ |
| Create DPR | ✓ | ✓ | ✓ |
| View Reports | ✓ | ✓ | ✓ |

*Manager can only update own projects

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@projectmanager.com",
    "password": "Admin@123"
  }'
```

### Create Project (with token)
```bash
curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "budget": 50000,
    "location": "Office"
  }'
```

---

## Environment Variables

```bash
DB_HOST=localhost              # MySQL host
DB_PORT=3306                   # MySQL port
DB_NAME=project_manager        # Database name
DB_USER=root                   # MySQL user
DB_PASSWORD=                   # MySQL password
PORT=5000                      # Server port
NODE_ENV=development           # Environment
JWT_SECRET=your_secret_key     # JWT signing key
JWT_EXPIRE=7d                  # Token expiration
API_BASE_URL=http://localhost:5000
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # Sequelize configuration
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── DailyReport.js
│   │   └── index.js            # Model associations
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── dprController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── dprRoutes.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication & RBAC
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── validators.js
│   │   └── errors.js
│   └── index.js                # Main server file
├── migrations/
│   └── init.js                 # Database initialization
├── package.json
├── .env.example
└── README.md
```

## Security Notes

1. Change `JWT_SECRET` in production
2. Use strong database passwords
3. Implement rate limiting for production
4. Use HTTPS in production
5. Validate all inputs (already implemented)
6. Keep dependencies updated

## Support

For issues or questions, check the error messages in response. All errors include descriptive messages for debugging.
#   p r o j e c t - m a n a g 
 
 
