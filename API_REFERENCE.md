# API Reference Card

Quick reference for all endpoints and their usage.

## Base URL
```
http://localhost:5000
```

## Authentication Header
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### POST /auth/register
Create a new user account
```
Body:
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "password": "string (required, min 6 chars)",
  "phone": "string (optional)"
}

Response: 201
{
  "success": true,
  "userId": number,
  "user": { id, name, email, role }
}
```

### POST /auth/login
Authenticate and get JWT token
```
Body:
{
  "email": "string (required)",
  "password": "string (required)"
}

Response: 200
{
  "success": true,
  "token": "string",
  "user": { id, name, email, role }
}
```

---

## Projects Endpoints

### POST /projects
Create new project (admin/manager only)
```
Headers: Authorization: Bearer TOKEN
Body:
{
  "name": "string (required)",
  "description": "string (optional)",
  "startDate": "YYYY-MM-DD (required)",
  "endDate": "YYYY-MM-DD (required)",
  "budget": "number (optional)",
  "location": "string (optional)"
}

Response: 201
{
  "success": true,
  "projectId": number,
  "project": { id, name, status, ... }
}
```

### GET /projects
List all projects with pagination
```
Headers: Authorization: Bearer TOKEN
Query Params:
  ?limit=10&offset=0
  ?status=active
  ?status=planned|active|completed

Response: 200
{
  "success": true,
  "data": [ { id, name, status, creator, ... } ],
  "pagination": { total, limit, offset }
}
```

### GET /projects/:id
Get single project details
```
Headers: Authorization: Bearer TOKEN
Path Params: :id (project ID)

Response: 200
{
  "success": true,
  "data": { id, name, description, status, dailyReports, ... }
}
```

### PUT /projects/:id
Update project (creator or admin only)
```
Headers: Authorization: Bearer TOKEN
Path Params: :id (project ID)
Body (all optional):
{
  "name": "string",
  "description": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "status": "planned|active|completed",
  "budget": "number",
  "location": "string"
}

Response: 200
{
  "success": true,
  "data": { id, name, ... }
}
```

### DELETE /projects/:id
Delete project (admin only)
```
Headers: Authorization: Bearer TOKEN
Path Params: :id (project ID)

Response: 200
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## Daily Progress Reports (DPR) Endpoints

### POST /projects/:id/dpr
Create daily report for project
```
Headers: Authorization: Bearer TOKEN
Path Params: :id (project ID)
Body:
{
  "date": "YYYY-MM-DD (required)",
  "work_description": "string (required)",
  "weather": "string (optional)",
  "worker_count": "number (required, min 1)"
}

Response: 201
{
  "success": true,
  "dprId": number,
  "data": { id, project_id, user_id, date, ... }
}
```

### GET /projects/:id/dpr
List daily reports for project
```
Headers: Authorization: Bearer TOKEN
Path Params: :id (project ID)
Query Params (optional):
  ?date=YYYY-MM-DD

Response: 200
{
  "success": true,
  "data": [
    {
      id,
      project_id,
      user_id,
      date,
      work_description,
      weather,
      worker_count,
      user: { id, name, email }
    }
  ]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Common Error Responses

### 401 - No Token
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 401 - Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 - Insufficient Permissions
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 400 - Validation Error
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

---

## User Roles & Permissions

### Admin
- ✓ Create projects
- ✓ Update any project
- ✓ Delete projects
- ✓ Create DPR
- ✓ View all data

### Manager
- ✓ Create projects
- ✓ Update own projects
- ✓ Create DPR
- ✓ View all data

### Worker
- ✗ Create projects
- ✗ Update projects
- ✓ Create DPR
- ✓ View all data

---

## Example: Complete Workflow

### 1. Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@projectmanager.com", "password": "Admin@123"}'
```
**Save token from response**

### 2. Create Project
```bash
curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "startDate": "2024-01-15",
    "endDate": "2024-06-30"
  }'
```
**Save projectId from response**

### 3. Create Daily Report
```bash
curl -X POST http://localhost:5000/projects/1/dpr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2024-01-15",
    "work_description": "Work completed today",
    "worker_count": 5
  }'
```

### 4. View Reports
```bash
curl -X GET http://localhost:5000/projects/1/dpr \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Sample Admin User

**Email:** admin@projectmanager.com  
**Password:** Admin@123  
**Role:** admin

---

## Field Validation Rules

| Field | Type | Rules |
|-------|------|-------|
| name | string | Required, non-empty |
| email | string | Required, valid email format, unique |
| password | string | Required, min 6 characters |
| phone | string | Optional, valid format |
| role | enum | admin \| manager \| worker |
| startDate | date | Required, YYYY-MM-DD format |
| endDate | date | Required, must be >= startDate |
| status | enum | planned \| active \| completed |
| date | date | Required, YYYY-MM-DD format |
| work_description | text | Required, non-empty |
| worker_count | number | Required, >= 1 |

---

## Testing Tools

### cURL
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@projectmanager.com", "password": "Admin@123"}'
```

### Postman
1. Create new POST request
2. URL: `http://localhost:5000/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (JSON): `{"email": "admin@projectmanager.com", "password": "Admin@123"}`
5. Send

### Thunder Client (VS Code)
1. Install extension
2. Create new request
3. Method: POST
4. URL: `http://localhost:5000/auth/login`
5. JSON body: `{"email": "admin@projectmanager.com", "password": "Admin@123"}`

---

## Quick Curl Commands

### Health Check
```bash
curl http://localhost:5000/health
```

### Register New User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'
```

### List Projects
```bash
curl -X GET "http://localhost:5000/projects?limit=10" \
  -H "Authorization: Bearer TOKEN"
```

---

For complete documentation, see README.md  
For testing guide, see TESTING.md  
For configuration, see CONFIG.md
