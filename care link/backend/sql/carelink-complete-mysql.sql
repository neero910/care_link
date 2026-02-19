-- ============================================================================
-- CareLINK Healthcare Management System - Complete MySQL Setup
-- All-in-one SQL file: Database creation + schema + sample data
-- ============================================================================

-- Drop existing database if needed (comment out if you want to keep existing data)
DROP DATABASE IF EXISTS carelink;

-- Create database
CREATE DATABASE carelink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carelink;

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- Users table: Contains all system users (admin, doctors, nurses, reception, managers)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'reception', 'manager') DEFAULT 'nurse',
  phone VARCHAR(20),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patients table: Patient profiles with medical information
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL CHECK (age >= 0 AND age <= 150),
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  medical_history TEXT,
  allergies TEXT,
  notes TEXT,
  registered_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_phone (phone),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments table: Doctor-patient appointment scheduling
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  appointment_time VARCHAR(5) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show') DEFAULT 'Scheduled',
  notes TEXT,
  duration INT DEFAULT 30,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Billing table: Patient billing and payment tracking
CREATE TABLE billing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  appointment_id INT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255) NOT NULL,
  status ENUM('Pending', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Pending',
  payment_method ENUM('Cash', 'Card', 'Insurance', 'Online', 'Other'),
  payment_date DATETIME,
  due_date DATETIME,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_patient_id (patient_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA (INSERT STATEMENTS)
-- ============================================================================

-- Insert test users with different roles
-- Password: admin123 (will be hashed in backend)
INSERT INTO users (name, username, email, password, role, phone, status) VALUES
('Admin User', 'admin', 'admin@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'admin', '555-0001', 'Active'),
('Dr. James Smith', 'doctor1', 'james.smith@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'doctor', '555-0002', 'Active'),
('Dr. Sarah Johnson', 'doctor2', 'sarah.johnson@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'doctor', '555-0003', 'Active'),
('Nurse Mike Brown', 'nurse1', 'mike.brown@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'nurse', '555-0004', 'Active'),
('Reception Lisa Davis', 'reception1', 'lisa.davis@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'reception', '555-0005', 'Active'),
('Manager Tom Wilson', 'manager1', 'tom.wilson@carelink.local', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'manager', '555-0006', 'Active');

-- Insert sample patients
INSERT INTO patients (name, age, gender, email, phone, address, medical_history, allergies, notes, registered_by) VALUES
('John Doe', 45, 'Male', 'john.doe@email.com', '555-1001', '123 Main St, Downtown', 'Hypertension, Diabetes Type 2', 'Penicillin, Shellfish', 'Regular check-ups every 3 months', 1),
('Mary Johnson', 38, 'Female', 'mary.j@email.com', '555-1002', '456 Oak Ave, Midtown', 'Asthma, High Cholesterol', 'Aspirin', 'Use inhaler daily', 1),
('Robert Wilson', 62, 'Male', 'r.wilson@email.com', '555-1003', '789 Pine Ln, Uptown', 'Heart Disease, Hypertension', 'NSAIDs', 'Cardiac history, take blood pressure daily', 1),
('Jennifer Lee', 29, 'Female', 'j.lee@email.com', '555-1004', '321 Elm St, Downtown', 'Thyroid Disease', 'None', 'Annual thyroid check', 1),
('Michael Brown', 55, 'Male', 'mbrown@email.com', '555-1005', '654 Maple Dr, Suburbs', 'Arthritis, Hypertension', 'Ibuprofen', 'Avoid heavy lifting', 1),
('Patricia Garcia', 41, 'Female', 'p.garcia@email.com', '555-1006', '987 Cedar Rd, Midtown', 'Migraine, Anxiety', 'Codeine', 'Stress management recommended', 1),
('David Martinez', 35, 'Male', 'dmartinez@email.com', '555-1007', '654 Birch St, Downtown', NULL, 'Latex', 'Annual physical scheduled', 1),
('Susan Anderson', 48, 'Female', 's.anderson@email.com', '555-1008', '321 Spruce Ave, Uptown', 'Osteoporosis', 'None', 'Calcium supplements prescribed', 1);

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, notes, duration, created_by) VALUES
(1, 2, '2026-02-20 09:00:00', '09:00', 'Regular Check-up', 'Scheduled', 'Monitor blood pressure', 30, 5),
(2, 3, '2026-02-20 10:00:00', '10:00', 'Asthma Review', 'Scheduled', 'Check inhaler usage', 30, 5),
(3, 2, '2026-02-21 14:00:00', '14:00', 'Cardiac Follow-up', 'Scheduled', 'Review recent test results', 45, 5),
(4, 3, '2026-02-22 11:00:00', '11:00', 'Thyroid Check', 'Scheduled', 'TSH level test required', 30, 5),
(5, 2, '2026-02-23 15:30:00', '15:30', 'Hypertension Management', 'Scheduled', 'Discuss medication adjustment', 30, 5),
(6, 3, '2026-02-24 10:30:00', '10:30', 'Migraine Consultation', 'Scheduled', 'Discuss preventive treatments', 30, 5),
(7, 2, '2026-02-25 09:00:00', '09:00', 'Annual Physical', 'Scheduled', 'Complete physical examination', 60, 5),
(8, 3, '2026-02-26 13:00:00', '13:00', 'Osteoporosis Assessment', 'Scheduled', 'Bone density check', 30, 5);

-- Insert sample billing records
INSERT INTO billing (patient_id, appointment_id, amount, description, status, payment_method, payment_date, due_date, notes, created_by) VALUES
(1, 1, 150.00, 'Regular Check-up - Dr. James Smith', 'Pending', NULL, NULL, '2026-03-06', 'Invoice sent', 6),
(2, 2, 200.00, 'Asthma Review - Dr. Sarah Johnson', 'Paid', 'Insurance', '2026-02-10', '2026-02-24', 'Insurance covered', 6),
(3, 3, 300.00, 'Cardiac Follow-up - Dr. James Smith', 'Pending', NULL, NULL, '2026-03-07', 'High priority follow-up', 6),
(4, 4, 150.00, 'Thyroid Check - Dr. Sarah Johnson', 'Pending', NULL, NULL, '2026-03-08', 'Lab work required', 6),
(5, NULL, 120.00, 'August Consultation - Dr. James Smith', 'Overdue', NULL, NULL, '2026-01-31', 'Payment reminder sent', 6),
(6, 6, 175.00, 'Migraine Consultation - Dr. Sarah Johnson', 'Paid', 'Card', '2026-02-15', '2026-03-01', 'Credit card payment', 6),
(7, 7, 250.00, 'Annual Physical - Dr. James Smith', 'Pending', NULL, NULL, '2026-03-11', 'Complete physical examination', 6),
(8, NULL, 180.00, 'Previous Consultation - Dr. Sarah Johnson', 'Paid', 'Cash', '2025-12-20', '2026-01-03', 'Cash payment received', 6);

-- ============================================================================
-- Test User Credentials (use with backend login)
-- ============================================================================
-- Username: admin          | Password: admin123        | Role: admin
-- Username: doctor1        | Password: admin123        | Role: doctor
-- Username: doctor2        | Password: admin123        | Role: doctor
-- Username: nurse1         | Password: admin123        | Role: nurse
-- Username: reception1     | Password: admin123        | Role: reception
-- Username: manager1       | Password: admin123        | Role: manager
-- ============================================================================

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Database: carelink
-- Tables: users, patients, appointments, billing
-- Test users: 6 users with different roles
-- Sample data: 8 patients, 8 appointments, 8 billing records
-- Ready to connect with Node.js backend on localhost:5000
-- ============================================================================
