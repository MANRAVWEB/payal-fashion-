<?php
// ============================================================================
// PAYAL FASHION STORE — WEBSITE SETTINGS API
// File: api/settings.php
// Supports GET (fetch settings) and POST (save settings)
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$jsonFile = APP_ROOT . '/data/settings.json';

// Canonical default settings
function getDefaultSettings() {
    return [
        'businessName' => 'PAYAL FASHION STORE',
        'store_name' => 'PAYAL FASHION STORE',
        'ownerName' => 'NIKHIL KISHOR KUMAR SHAH',
        'tagline' => 'HANDCRAFTED BRIDAL & FESTIVE COUTURE',
        'phone' => '+91 8209206788',
        'whatsapp' => '+91 8209206788',
        'email' => 'payalcreation10@gmail.com',
        'ownerLeadEmail' => 'payalcreation10@gmail.com',
        'address' => '17TH FLOOR, 1701, CASA RARE, R M BHATTAD ROAD, BORIVALI WEST, MUMBAI SUBURBAN, MAHARASHTRA, 400092',
        'gstin' => '27AOUPS8724B1ZF',
        'cityState' => 'Borivali West, Maharashtra',
        'pincode' => '400092',
        'businessType' => 'REGULAR',
        'operatingStatus' => 'ONLINE SELLER',
        'heroHeadline' => 'Handcrafted Luxury Bridal & Festive Couture.',
        'heroDesc' => 'Discover exquisite designer lehenga choli and pure silk sarees crafted with love, fine zardozi embroidery, and timeless silhouettes. Handcrafted by master artisans with direct boutique pricing.',
        'admin_username' => 'payal',
        'currency' => 'INR'
    ];
}

function getSettingsFromJson($path) {
    $defaults = getDefaultSettings();
    if (!file_exists($path)) {
        return $defaults;
    }
    $raw = @file_get_contents($path);
    $d = json_decode($raw, true);
    if (!is_array($d)) {
        return $defaults;
    }
    // Harmonize businessName and store_name
    if (!empty($d['store_name']) && empty($d['businessName'])) {
        $d['businessName'] = $d['store_name'];
    } elseif (!empty($d['businessName']) && empty($d['store_name'])) {
        $d['store_name'] = $d['businessName'];
    }
    return array_merge($defaults, $d);
}

function saveSettingsToJson($path, $settings) {
    $dataDir = dirname($path);
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    // Never write password hash to json
    unset($settings['admin_password_hash']);
    unset($settings['admin_password']);
    @file_put_contents($path, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// 1. GET: Fetch website settings
if ($method === 'GET') {
    $settings = getDefaultSettings();
    $source = 'defaults';

    if ($useMySQL && $pdo) {
        try {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM `settings`");
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $dbMap = [];
                foreach ($rows as $r) {
                    $dbMap[$r['setting_key']] = $r['setting_value'];
                }
                unset($dbMap['admin_password_hash']);
                unset($dbMap['admin_password']);
                if (!empty($dbMap['store_name']) && empty($dbMap['businessName'])) {
                    $dbMap['businessName'] = $dbMap['store_name'];
                } elseif (!empty($dbMap['businessName']) && empty($dbMap['store_name'])) {
                    $dbMap['store_name'] = $dbMap['businessName'];
                }
                $settings = array_merge($settings, $dbMap);
                $source = 'mysql';
            }
        } catch (Exception $e) {
            error_log("Settings GET MySQL error: " . $e->getMessage());
        }
    }

    if ($source !== 'mysql') {
        $settings = getSettingsFromJson($jsonFile);
        $source = 'json_fallback';
    }

    sendJsonResponse([
        'success' => true,
        'source' => $source,
        'settings' => $settings
    ], 200);
}

// 2. POST: Update website settings
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    if (!is_array($data) || empty($data)) {
        $data = $_POST;
    }

    if (empty($data) || !is_array($data)) {
        sendJsonResponse(['success' => false, 'error' => 'No settings data provided in request body.'], 400);
    }

    $current = getSettingsFromJson($jsonFile);
    $allowed = [
        'businessName', 'store_name', 'tagline', 'phone', 'whatsapp',
        'email', 'ownerLeadEmail', 'address', 'gstin', 'cityState',
        'heroHeadline', 'heroDesc', 'admin_username', 'admin_password', 'currency'
    ];

    foreach ($allowed as $k) {
        if (isset($data[$k])) {
            $val = trim((string)$data[$k]);

            if ($k === 'admin_password') {
                if (!empty($val)) {
                    $hash = password_hash($val, PASSWORD_BCRYPT);
                    if ($useMySQL && $pdo) {
                        try {
                            $stmt = $pdo->prepare("INSERT INTO `settings` (setting_key, setting_value) VALUES ('admin_password_hash', :val) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                            $stmt->execute([':val' => $hash]);

                            $uStmt = $pdo->prepare("UPDATE `admins` SET password_hash = :hash WHERE username = 'payal' OR id = 1");
                            $uStmt->execute([':hash' => $hash]);
                        } catch (Exception $e) {
                            error_log("Settings password update error: " . $e->getMessage());
                        }
                    }
                }
                continue;
            }

            $current[$k] = $val;

            // Sync aliases
            if ($k === 'businessName') $current['store_name'] = $val;
            if ($k === 'store_name') $current['businessName'] = $val;
            if ($k === 'phone' && empty($data['whatsapp'])) $current['whatsapp'] = $val;

            if ($useMySQL && $pdo) {
                try {
                    $stmt = $pdo->prepare("INSERT INTO `settings` (setting_key, setting_value) VALUES (:k, :val) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $stmt->execute([':k' => $k, ':val' => $val]);
                } catch (Exception $e) {
                    error_log("Settings MySQL save error for key $k: " . $e->getMessage());
                }
            }
        }
    }

    saveSettingsToJson($jsonFile, $current);

    unset($current['admin_password_hash']);
    unset($current['admin_password']);

    sendJsonResponse([
        'success' => true,
        'message' => 'Website settings saved and synchronized successfully!',
        'settings' => $current
    ], 200);
}

// Any other HTTP method
sendJsonResponse([
    'success' => false,
    'error' => "Method {$method} not allowed on this endpoint. Supported methods are GET and POST."
], 405);
