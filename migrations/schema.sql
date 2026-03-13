-- Project Manager Database Schema

-- Drop existing database if needed (uncomment to use)
-- DROP DATABASE IF EXISTS project_manager;

-- Create database
CREATE DATABASE IF NOT EXISTS project_manager
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE project_manager;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'manager', 'worker') DEFAULT 'worker' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(15, 2),
  location VARCHAR(255),
  status ENUM('planned', 'active', 'completed') DEFAULT 'planned' NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_created_by (created_by),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily Reports Table
CREATE TABLE IF NOT EXISTS daily_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  work_description TEXT NOT NULL,
  weather VARCHAR(100),
  worker_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  UNIQUE KEY unique_daily_report (project_id, user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Assignments Table
CREATE TABLE IF NOT EXISTS project_assignments (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pa_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Admin User
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@projectmanager.com', '$2a$10$aQUDRMtG1kPPyZ68Z4Okp.hmGiwt/N6BKjJyjfPiPo6uUzll/Dr9y', 'admin')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  name = VALUES(name);

-- Optional: Sample Manager User
-- Password: Manager@123
-- INSERT INTO users (name, email, password_hash, role) VALUES
-- ('Manager User', 'manager@projectmanager.com', '$2a$10$...', 'manager');

-- Optional: Sample Worker User
-- Password: Worker@123
-- INSERT INTO users (name, email, password_hash, role) VALUES
-- ('Worker User', 'worker@projectmanager.com', '$2a$10$...', 'worker');

-- Create views (optional)
-- View to get project summary with creator info
CREATE OR REPLACE VIEW v_projects_summary AS
SELECT 
  p.id,
  p.name,
  p.status,
  p.start_date,
  p.end_date,
  p.budget,
  u.name AS created_by_name,
  u.email AS created_by_email,
  COUNT(DISTINCT dr.id) AS total_reports,
  MAX(dr.date) AS latest_report_date
FROM projects p
LEFT JOIN users u ON p.created_by = u.id
LEFT JOIN daily_reports dr ON p.id = dr.project_id
GROUP BY p.id;

-- View to get daily reports with project and user details
CREATE OR REPLACE VIEW v_daily_reports_detail AS
SELECT 
  dr.id,
  dr.date,
  dr.work_description,
  dr.weather,
  dr.worker_count,
  p.name AS project_name,
  u.name AS reported_by_name,
  u.email AS reported_by_email
FROM daily_reports dr
LEFT JOIN projects p ON dr.project_id = p.id
LEFT JOIN users u ON dr.user_id = u.id;
