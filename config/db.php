<?php
// ============================================================================
// PAYAL FASHION STORE — DATABASE & BACKEND CONFIGURATION
// File: config/db.php
// ============================================================================

// Prevent direct script output buffering issues
if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}

// Global Response Helper
function sendJsonResponse($data, $statusCode = 200) {
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// Default REQUEST_METHOD if running via CLI or non-HTTP environment
if (!isset($_SERVER['REQUEST_METHOD'])) {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(204);
    exit;
}

class Database {
    private static $host = '127.0.0.1';
    private static $port = 3306;
    private static $db_name = 'payal_fashion_db';
    private static $username = 'root';
    private static $password = '';
    private static $pdo = null;
    private static $mysqlAvailable = null;

    /**
     * Get active PDO connection (or null if MySQL offline)
     */
    public static function getConnection() {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        if (self::$mysqlAvailable === false) {
            return null;
        }

        try {
            // First connect without db name to ensure DB exists
            $dsnNoDb = "mysql:host=" . self::$host . ";port=" . self::$port . ";charset=utf8mb4";
            $tempPdo = new PDO($dsnNoDb, self::$username, self::$password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 2
            ]);

            // Ensure database exists
            $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `" . self::$db_name . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $tempPdo = null;

            // Connect to target database
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$db_name . ";charset=utf8mb4";
            self::$pdo = new PDO($dsn, self::$username, self::$password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);

            self::$mysqlAvailable = true;
            self::ensureTables();
            return self::$pdo;
        } catch (Exception $e) {
            self::$mysqlAvailable = false;
            self::$pdo = null;
            return null;
        }
    }

    public static function isMySQLAvailable() {
        if (self::$mysqlAvailable === null) {
            self::getConnection();
        }
        return (bool)self::$mysqlAvailable;
    }

    /**
     * Auto-migrate schema & seed initial data
     */
    private static function ensureTables() {
        if (!self::$pdo) return;

        $schemaFile = APP_ROOT . '/database/schema.sql';
        if (file_exists($schemaFile)) {
            $sql = file_get_contents($schemaFile);
            try {
                self::$pdo->exec($sql);
            } catch (Exception $e) {
                // Ignore if tables exist
            }
        }

        // Check if products table is empty, seed from data/products.json
        try {
            $stmt = self::$pdo->query("SELECT COUNT(*) FROM `products`");
            $count = (int)$stmt->fetchColumn();
            if ($count === 0) {
                self::seedProductsFromJSON();
            }
        } catch (Exception $e) {}

        // Check if home_photos table is empty, seed from data/home_photos.json
        try {
            $stmt = self::$pdo->query("SELECT COUNT(*) FROM `home_photos`");
            $count = (int)$stmt->fetchColumn();
            if ($count === 0) {
                self::seedHomePhotosFromJSON();
            }
        } catch (Exception $e) {}
    }

    private static function seedProductsFromJSON() {
        $jsonFile = APP_ROOT . '/data/products.json';
        if (!file_exists($jsonFile)) return;
        $items = json_decode(file_get_contents($jsonFile), true);
        if (!is_array($items)) return;

        $sql = "INSERT INTO `products` (id, name, sku, category, collection, fabric, work, color, occasion, sizes, availability, wholesale, retail, priceVisibility, priceText, image, gallery, description)
                VALUES (:id, :name, :sku, :category, :collection, :fabric, :work, :color, :occasion, :sizes, :availability, :wholesale, :retail, :priceVisibility, :priceText, :image, :gallery, :description)";
        $stmt = self::$pdo->prepare($sql);

        foreach ($items as $p) {
            $stmt->execute([
                ':id' => isset($p['id']) ? (int)$p['id'] : null,
                ':name' => $p['name'] ?? ($p['title'] ?? 'Untitled Design'),
                ':sku' => $p['sku'] ?? ('PMH-' . rand(100, 999)),
                ':category' => $p['category'] ?? 'Bridal Lehengas',
                ':collection' => $p['collection'] ?? 'Bridal Wear',
                ':fabric' => $p['fabric'] ?? 'Heritage Silk',
                ':work' => $p['work'] ?? 'Handcrafted Zardozi',
                ':color' => $p['color'] ?? 'Royal Crimson',
                ':occasion' => $p['occasion'] ?? 'Bridal / Wedding',
                ':sizes' => $p['sizes'] ?? 'Semi-stitched',
                ':availability' => $p['availability'] ?? ($p['status'] ?? 'Available'),
                ':wholesale' => !empty($p['wholesale']) ? 1 : 1,
                ':retail' => !empty($p['retail']) ? 1 : 1,
                ':priceVisibility' => $p['priceVisibility'] ?? ($p['price_visibility'] ?? 'enquiry'),
                ':priceText' => $p['priceText'] ?? 'Price on Enquiry',
                ':image' => $p['image'] ?? 'assets/images/collection-bridal.jpg',
                ':gallery' => isset($p['gallery']) ? (is_array($p['gallery']) ? json_encode($p['gallery']) : $p['gallery']) : null,
                ':description' => $p['description'] ?? ''
            ]);
        }
    }

    private static function seedHomePhotosFromJSON() {
        $jsonFile = APP_ROOT . '/data/home_photos.json';
        if (!file_exists($jsonFile)) return;
        $photos = json_decode(file_get_contents($jsonFile), true);
        if (!is_array($photos)) return;

        $sql = "INSERT INTO `home_photos` (photo_key, url, title, subtitle, badge)
                VALUES (:photo_key, :url, :title, :subtitle, :badge)
                ON DUPLICATE KEY UPDATE url = VALUES(url)";
        $stmt = self::$pdo->prepare($sql);

        foreach ($photos as $key => $val) {
            $stmt->execute([
                ':photo_key' => $key,
                ':url' => is_array($val) ? ($val['url'] ?? '') : (string)$val,
                ':title' => is_array($val) ? ($val['title'] ?? '') : '',
                ':subtitle' => is_array($val) ? ($val['subtitle'] ?? '') : '',
                ':badge' => is_array($val) ? ($val['badge'] ?? '') : ''
            ]);
        }
    }
}
