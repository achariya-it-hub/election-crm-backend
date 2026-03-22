-- Election CRM Database Schema

CREATE DATABASE IF NOT EXISTS election_crm;
USE election_crm;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('Admin', 'Coordinator', 'Booth Captain') DEFAULT 'Booth Captain',
    booth_id INT DEFAULT NULL,
    last_active DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Booths Table
CREATE TABLE booths (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    number VARCHAR(20) NOT NULL,
    address TEXT,
    officer_in_charge VARCHAR(100),
    contact_number VARCHAR(20),
    location_lat DECIMAL(10, 8) DEFAULT 10.0104,
    location_lng DECIMAL(11, 8) DEFAULT 77.4768,
    total_voters INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Voters Table
CREATE TABLE voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booth_id INT,
    name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100),
    age INT,
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    address TEXT,
    phone VARCHAR(20),
    voter_id VARCHAR(50) UNIQUE,
    support_level ENUM('Supporter', 'Neutral', 'Hater', 'Dark') DEFAULT 'Neutral',
    family_benefits JSON,
    notes TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE SET NULL
);

-- Volunteers Table
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booth_id INT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_type VARCHAR(50),
    assigned_area VARCHAR(200),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE SET NULL
);

-- Booth-Volunteer Mapping
CREATE TABLE booth_volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booth_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_mapping (booth_id, volunteer_id)
);

-- Complaints Table
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booth_id INT,
    voter_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    created_by INT,
    assigned_to INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE SET NULL,
    FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Campaigns Table
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATETIME,
    location VARCHAR(200),
    booth_id INT,
    status ENUM('Planning', 'Active', 'Completed', 'Cancelled') DEFAULT 'Planning',
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings Table (single row)
CREATE TABLE settings (
    id INT PRIMARY KEY DEFAULT 1,
    support_levels JSON,
    benefits JSON,
    theme_color VARCHAR(20) DEFAULT '#4f46e5',
    logo VARCHAR(500),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (id, support_levels, benefits) VALUES (1, 
    '{"Supporter": "Supporter", "Neutral": "Neutral", "Hater": "Hater", "Dark": "Dark"}',
    '["Ration Card", "Old Age Pension", "Farmer Subsidy", "Housing Scheme"]'
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, name, role) VALUES (
    'admin',
    '$2a$10$8K1p/a0dR1xqM8K9Q6hq.8K3lDv7Yz5H5XqkYcGfR6wPQhJyqCqLy',
    'Administrator',
    'Admin'
);
