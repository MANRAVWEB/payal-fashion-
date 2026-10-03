<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['type']) || !isset($data['payload'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid data payload']);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$type = $data['type'];
$filename = '';

if ($type === 'products') {
    $filename = $dataDir . '/products.json';
} elseif ($type === 'home_photos') {
    $filename = $dataDir . '/home_photos.json';
} elseif ($type === 'settings') {
    $filename = $dataDir . '/settings.json';
} elseif ($type === 'customers') {
    $filename = $dataDir . '/customers.json';
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Unknown data type']);
    exit;
}

file_put_contents($filename, json_encode($data['payload'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'success' => true,
    'message' => 'Data synced successfully',
    'timestamp' => time()
]);
