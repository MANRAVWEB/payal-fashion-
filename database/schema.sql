-- ============================================================================
-- PAYAL FASHION STORE (BORIVALI WEST, MUMBAI SUBURBAN)
-- Complete MySQL Database Schema
-- Database: payal_fashion_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `payal_fashion_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `payal_fashion_db`;

-- 1. Products Table (matches exact frontend schema)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) DEFAULT '',
  `category` VARCHAR(100) NOT NULL,
  `collection` VARCHAR(100) DEFAULT '',
  `fabric` VARCHAR(200) NOT NULL,
  `work` VARCHAR(255) NOT NULL,
  `color` VARCHAR(100) DEFAULT '',
  `occasion` VARCHAR(150) DEFAULT '',
  `sizes` VARCHAR(150) DEFAULT '',
  `availability` VARCHAR(50) DEFAULT 'Available',
  `wholesale` TINYINT(1) DEFAULT 1,
  `retail` TINYINT(1) DEFAULT 1,
  `priceVisibility` VARCHAR(50) DEFAULT 'enquiry',
  `priceText` VARCHAR(100) DEFAULT 'Price on Enquiry',
  `image` VARCHAR(500) NOT NULL,
  `gallery` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Homepage Photos Table
CREATE TABLE IF NOT EXISTS `home_photos` (
  `photo_key` VARCHAR(100) PRIMARY KEY,
  `url` TEXT NOT NULL,
  `title` VARCHAR(200) DEFAULT '',
  `subtitle` VARCHAR(255) DEFAULT '',
  `badge` VARCHAR(100) DEFAULT '',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT 'General Enquiry',
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(150) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `event_date` VARCHAR(50) DEFAULT '',
  `message` TEXT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'New',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Wholesale / B2B Leads Table
CREATE TABLE IF NOT EXISTS `wholesale_leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_name` VARCHAR(200) NOT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `state` VARCHAR(100) DEFAULT '',
  `gstin` VARCHAR(50) DEFAULT '',
  `approx_quantity` VARCHAR(100) DEFAULT '',
  `message` TEXT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'New',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Customer Login Leads Table
CREATE TABLE IF NOT EXISTS `login_leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) DEFAULT '',
  `ip_address` VARCHAR(50) DEFAULT '',
  `source` VARCHAR(100) DEFAULT 'Direct Website Modal',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Store Website Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Admin Accounts Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'owner',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `admins` (`id`, `username`, `password_hash`, `email`, `role`)
VALUES (1, 'payal', '$2y$10$wU05421v0310m0Q.1VjKfevXl23m1aI2zQk4bK34Qd50L31G51K2W', 'payalcreation10@gmail.com', 'owner');
