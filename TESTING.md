# Testing Guide

This guide provides examples for testing all API endpoints using PostMan, cURL, or any HTTP client.

## Setup

1. Start the server:
   ```bash
   npm start
   # or for hot reload:
   npm run dev
   ```

2. Verify server is running:
   ```bash
   curl http://localhost:5000/health
   ```

## Test Sequence

### 1. Authentication

#### Register a New User
```
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 2,
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "worker"
  }
}
```

#### Login with Admin
```
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "admin@projectmanager.com",
  "password": "Admin@123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@projectmanager.com",
    "role": "admin"
  }
}
```

**Save the token for next requests:** `YOUR_TOKEN`

#### Login with Regular User
```
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

---

### 2. Projects Management

Use the token from admin login for these requests.

#### Create a Project
```
POST http://localhost:5000/projects
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Mobile App Development",
  "description": "Develop iOS and Android mobile application",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "budget": 150000,
  "location": "Company Office"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "projectId": 1,
  "project": {
    "id": 1,
    "name": "Mobile App Development",
    "description": "Develop iOS and Android mobile application",
    "start_date": "2024-01-15",
    "end_date": "2024-06-30",
    "budget": "150000.00",
    "location": "Company Office",
    "status": "planned",
    "created_by": 1,
    "created_at": "2024-01-12T10:30:00.000Z",
    "updated_at": "2024-01-12T10:30:00.000Z"
  }
}
```

Save the `projectId`: `PROJECT_ID = 1`

#### Create Another Project
```
POST http://localhost:5000/projects
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "startDate": "2024-02-01",
  "endDate": "2024-05-30",
  "budget": 75000,
  "location": "Remote"
}
```

#### List All Projects
```
GET http://localhost:5000/projects?limit=10&offset=0
Authorization: Bearer YOUR_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Mobile App Development",
      "status": "planned",
      "start_date": "2024-01-15",
      "end_date": "2024-06-30",
      "creator": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    },
    {
      "id": 2,
      "name": "Website Redesign",
      "status": "planned",
      "start_date": "2024-02-01",
      "end_date": "2024-05-30",
      "creator": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 10,
    "offset": 0
  }
}
```

#### Filter Projects by Status
```
GET http://localhost:5000/projects?status=active&limit=10&offset=0
Authorization: Bearer YOUR_TOKEN
```

#### Get Single Project Details
```
GET http://localhost:5000/projects/1
Authorization: Bearer YOUR_TOKEN
```

#### Update Project
```
PUT http://localhost:5000/projects/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "active",
  "name": "Mobile App Development - Phase 1"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": 1,
    "name": "Mobile App Development - Phase 1",
    "status": "active",
    "start_date": "2024-01-15",
    "end_date": "2024-06-30"
  }
}
```

#### Mark Project as Completed
```
PUT http://localhost:5000/projects/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Project (Admin Only)
```
DELETE http://localhost:5000/projects/2
Authorization: Bearer YOUR_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 3. Daily Progress Reports

#### Create Daily Report
```
POST http://localhost:5000/projects/1/dpr
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2024-01-15",
  "work_description": "Completed UI mockups for login and dashboard screens. Conducted design review with stakeholders.",
  "weather": "Sunny",
  "worker_count": 4
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Daily report created successfully",
  "dprId": 1,
  "data": {
    "id": 1,
    "project_id": 1,
    "user_id": 1,
    "date": "2024-01-15",
    "work_description": "Completed UI mockups for login and dashboard screens. Conducted design review with stakeholders.",
    "weather": "Sunny",
    "worker_count": 4,
    "created_at": "2024-01-15T09:00:00.000Z",
    "updated_at": "2024-01-15T09:00:00.000Z"
  }
}
```

#### Create Multiple Daily Reports
```
POST http://localhost:5000/projects/1/dpr
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2024-01-16",
  "work_description": "API endpoint development - authentication module completed. 60% of CRUD operations done.",
  "weather": "Cloudy",
  "worker_count": 5
}
```

```
POST http://localhost:5000/projects/1/dpr
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2024-01-17",
  "work_description": "Database schema optimization. Completed indexing for improved query performance.",
  "weather": "Rainy",
  "worker_count": 3
}
```

#### Get All Daily Reports for a Project
```
GET http://localhost:5000/projects/1/dpr
Authorization: Bearer YOUR_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Daily reports retrieved successfully",
  "data": [
    {
      "id": 3,
      "project_id": 1,
      "user_id": 1,
      "date": "2024-01-17",
      "work_description": "Database schema optimization. Completed indexing for improved query performance.",
      "weather": "Rainy",
      "worker_count": 3,
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    },
    {
      "id": 2,
      "project_id": 1,
      "user_id": 1,
      "date": "2024-01-16",
      "work_description": "API endpoint development - authentication module completed. 60% of CRUD operations done.",
      "weather": "Cloudy",
      "worker_count": 5,
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    },
    {
      "id": 1,
      "project_id": 1,
      "user_id": 1,
      "date": "2024-01-15",
      "work_description": "Completed UI mockups for login and dashboard screens. Conducted design review with stakeholders.",
      "weather": "Sunny",
      "worker_count": 4,
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@projectmanager.com"
      }
    }
  ]
}
```

#### Filter Reports by Date
```
GET http://localhost:5000/projects/1/dpr?date=2024-01-16
Authorization: Bearer YOUR_TOKEN
```

---

### 4. Error Testing

#### Test Invalid Token
```
GET http://localhost:5000/projects/1
Authorization: Bearer invalid_token
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### Test Missing Token
```
GET http://localhost:5000/projects/1
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

#### Test Invalid Date Format
```
POST http://localhost:5000/projects
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Invalid Project",
  "startDate": "invalid-date",
  "endDate": "2024-06-30"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "startDate",
      "message": "Valid start date is required"
    }
  ]
}
```

#### Test Invalid Email
```
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "invalid-email",
  "password": "password123"
}
```

**Expected Response (400):**
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

#### Test Duplicate Email
```
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Admin User 2",
  "email": "admin@projectmanager.com",
  "password": "password123"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

## cURL Examples

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

### Create Project
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "startDate": "2024-01-15",
    "endDate": "2024-06-30",
    "budget": 100000,
    "location": "Office"
  }'
```

### Get All Projects
```bash
TOKEN="your_jwt_token_here"

curl -X GET "http://localhost:5000/projects?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Daily Report
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/projects/1/dpr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "date": "2024-01-15",
    "work_description": "Completed design mockups",
    "weather": "Sunny",
    "worker_count": 5
  }'
```

## Postman Collection

You can import the endpoints into Postman. Here's a template for the environment variables:

```json
{
  "BASE_URL": "http://localhost:5000",
  "TOKEN": "your_jwt_token_here",
  "PROJECT_ID": 1
}
```

Then use `{{BASE_URL}}`, `{{TOKEN}}`, and `{{PROJECT_ID}}` in your requests.

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- Preserve tokens from login responses for subsequent authenticated requests
- All email addresses must be unique
- Start date must be before end date for projects
- Remove project before testing date constrain to see it in action
