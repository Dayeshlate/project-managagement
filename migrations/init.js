const mysql = require('mysql2/promise');
require('dotenv').config();

const SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'worker') DEFAULT 'worker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
  )`,
  
  `CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(15, 2),
    location VARCHAR(255),
    status ENUM('planned', 'active', 'completed') DEFAULT 'planned',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_start_date (start_date)
  )`,
  
  `CREATE TABLE IF NOT EXISTS daily_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    work_description TEXT NOT NULL,
    weather VARCHAR(100),
    worker_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    UNIQUE KEY unique_daily_report (project_id, user_id, date)
  )`,

  `CREATE TABLE IF NOT EXISTS project_assignments (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pa_user_id (user_id)
  )`,
  
  `INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin User', 'admin@projectmanager.com', '$2a$10$aQUDRMtG1kPPyZ68Z4Okp.hmGiwt/N6BKjJyjfPiPo6uUzll/Dr9y', 'admin')
  ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    role = VALUES(role),
    name = VALUES(name)`
];

const initializeDatabase = async () => {
  let connection;
  try {
    // Connect without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: false
    });

    const dbName = process.env.DB_NAME || 'project_manager';

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' created/verified`);

    // Create new connection to the specific database
    await connection.end();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      multipleStatements: false
    });

    // Execute schema statements
    for (const statement of SQL_STATEMENTS) {
      await connection.query(statement);
    }

    console.log('✓ Database schema initialized successfully');
    console.log('\nSample Admin User:');
    console.log('  Email: admin@projectmanager.com');
    console.log('  Password: Admin@123');
    console.log('  Role: admin');

  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

initializeDatabase();
