<?php
// ============================================================================
// PAYAL FASHION STORE — REGISTERED CUSTOMERS API
// File: api/customers.php
// ============================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = dirname(__DIR__) . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}
$jsonFile = $dataDir . '/customers.json';

function getCustomersFromJson($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function saveCustomersToJson($path, $items) {
    file_put_contents($path, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

function cleanDigits($phone) {
    $digits = preg_replace('/[^0-9]/', '', (string)$phone);
    return strlen($digits) >= 10 ? substr($digits, -10) : $digits;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $customers = getCustomersFromJson($jsonFile);
    echo json_encode([
        'success' => true,
        'count' => count($customers),
        'customers' => $customers
    ]);
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $customer = json_decode($rawInput, true);

    if (!$customer || empty($customer['phone'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid phone number is required']);
        exit;
    }

    $existing = getCustomersFromJson($jsonFile);
    $newClean = cleanDigits($customer['phone']);
    $found = false;

    foreach ($existing as $idx => $item) {
        $itemClean = cleanDigits($item['phone'] ?? '');
        if ($newClean !== '' && $newClean === $itemClean) {
            // Update existing record
            $existing[$idx] = array_merge($item, $customer);
            $found = true;
            break;
        }
    }

    if (!$found) {
        $existing[] = $customer;
    }

    saveCustomersToJson($jsonFile, $existing);

    echo json_encode([
        'success' => true,
        'message' => 'Customer registered successfully',
        'customer' => $customer,
        'total' => count($existing)
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
