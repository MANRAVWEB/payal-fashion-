<?php
// ============================================================================
// PAYAL FASHION STORE — HOMEPAGE PHOTOS API
// File: api/home_photos.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$jsonFile = APP_ROOT . '/data/home_photos.json';

function getHomePhotosFromJson($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    if (!is_array($data)) return [];
    // Normalize into flat string values
    $normalized = [];
    foreach ($data as $k => $v) {
        $normalized[$k] = is_array($v) ? ($v['url'] ?? '') : (string)$v;
    }
    return $normalized;
}

function saveHomePhotosToJson($path, $photos) {
    file_put_contents($path, json_encode($photos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------------------
// 1. GET: Fetch All Homepage Photos as a flat Key -> URL map
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    if ($useMySQL) {
        try {
            $stmt = $pdo->query("SELECT photo_key, url FROM `home_photos`");
            $rows = $stmt->fetchAll();
            $photoMap = [];
            foreach ($rows as $r) {
                $photoMap[$r['photo_key']] = $r['url'];
            }
            if (!empty($photoMap)) {
                sendJsonResponse(['success' => true, 'source' => 'mysql', 'photos' => $photoMap]);
            }
        } catch (Exception $e) {}
    }

    $photos = getHomePhotosFromJson($jsonFile);
    sendJsonResponse(['success' => true, 'source' => 'json_fallback', 'photos' => $photos]);
}

// ----------------------------------------------------------------------------
// 2. POST: Update Homepage Photos
// ----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true) ?: $_POST;

    $photos = getHomePhotosFromJson($jsonFile);

    // Support single item { photo_key: "...", url: "..." }
    if (isset($payload['photo_key']) && isset($payload['url'])) {
        $k = $payload['photo_key'];
        $url = trim($payload['url']);
        $photos[$k] = $url;

        if ($useMySQL) {
            try {
                $stmt = $pdo->prepare("INSERT INTO `home_photos` (photo_key, url) VALUES (:k, :u) ON DUPLICATE KEY UPDATE url = VALUES(url)");
                $stmt->execute([':k' => $k, ':u' => $url]);
            } catch (Exception $e) {}
        }
    }
    // Support map { photos: { ... } } or { payload: { ... } } or raw dictionary
    else {
        $items = $payload['photos'] ?? ($payload['payload'] ?? $payload);
        if (is_array($items)) {
            foreach ($items as $k => $val) {
                if ($k === 'type' || $k === '_method') continue;
                $url = is_array($val) ? ($val['url'] ?? '') : (string)$val;
                if (!empty($url)) {
                    $photos[$k] = $url;
                    if ($useMySQL) {
                        try {
                            $stmt = $pdo->prepare("INSERT INTO `home_photos` (photo_key, url) VALUES (:k, :u) ON DUPLICATE KEY UPDATE url = VALUES(url)");
                            $stmt->execute([':k' => $k, ':u' => $url]);
                        } catch (Exception $e) {}
                    }
                }
            }
        }
    }

    // Always update JSON mirror file
    saveHomePhotosToJson($jsonFile, $photos);

    sendJsonResponse([
        'success' => true,
        'message' => 'Homepage photos updated successfully across all devices!',
        'photos' => $photos
    ]);
}

sendJsonResponse(['success' => false, 'error' => 'Method not supported.'], 405);
