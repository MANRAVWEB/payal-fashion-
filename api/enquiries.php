<?php
// ============================================================================
// PAYAL FASHION STORE — CUSTOMER ENQUIRIES API
// File: api/enquiries.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$jsonFile = APP_ROOT . '/data/enquiries.json';

function getEnquiriesFromJson($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function saveEnquiriesToJson($path, $items) {
    file_put_contents($path, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle POST method spoofing
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $parsedJson = json_decode($rawInput, true);
    if (!empty($_POST['_method']) && strtoupper($_POST['_method']) === 'PUT') $method = 'PUT';
    if (!empty($parsedJson['_method']) && strtoupper($parsedJson['_method']) === 'PUT') $method = 'PUT';
}

// 1. GET: List Enquiries
if ($method === 'GET') {
    $rows = [];
    $source = 'json_fallback';

    if ($useMySQL && $pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `enquiries` ORDER BY id DESC");
            $rows = $stmt->fetchAll();
            $source = 'mysql';
        } catch (Exception $e) {
            error_log("Enquiries GET MySQL error: " . $e->getMessage());
        }
    }

    if (empty($rows)) {
        $rows = getEnquiriesFromJson($jsonFile);
    }

    $normalized = [];
    foreach ($rows as $r) {
        $normalized[] = [
            'id' => $r['id'] ?? null,
            'customerName' => $r['customerName'] ?? ($r['customer_name'] ?? 'Guest Customer'),
            'customer_name' => $r['customer_name'] ?? ($r['customerName'] ?? 'Guest Customer'),
            'mobileNumber' => $r['mobileNumber'] ?? ($r['customer_phone'] ?? ($r['phone'] ?? '')),
            'customer_phone' => $r['customer_phone'] ?? ($r['mobileNumber'] ?? ($r['phone'] ?? '')),
            'emailAddress' => $r['emailAddress'] ?? ($r['customer_email'] ?? ($r['email'] ?? '')),
            'customer_email' => $r['customer_email'] ?? ($r['emailAddress'] ?? ($r['email'] ?? '')),
            'productName' => $r['productName'] ?? ($r['product_name'] ?? 'Boutique Enquiry'),
            'product_name' => $r['product_name'] ?? ($r['productName'] ?? 'Boutique Enquiry'),
            'productId' => $r['productId'] ?? ($r['product_id'] ?? null),
            'product_id' => $r['product_id'] ?? ($r['productId'] ?? null),
            'quantity' => $r['quantity'] ?? 1,
            'requirementType' => $r['requirementType'] ?? ($r['requirement_type'] ?? 'Retail Purchase'),
            'city' => $r['city'] ?? '',
            'eventDate' => $r['eventDate'] ?? ($r['event_date'] ?? ''),
            'message' => $r['message'] ?? '',
            'status' => $r['status'] ?? 'New',
            'created_at' => $r['created_at'] ?? date('Y-m-d H:i:s')
        ];
    }

    sendJsonResponse(['success' => true, 'source' => $source, 'count' => count($normalized), 'enquiries' => $normalized], 200);
}

// 2. POST: Submit New Enquiry
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $name = trim($data['customer_name'] ?? $data['customerName'] ?? $data['name'] ?? '');
    $phone = trim($data['customer_phone'] ?? $data['mobileNumber'] ?? $data['phone'] ?? '');

    if (empty($name) || empty($phone)) {
        sendJsonResponse(['success' => false, 'error' => 'Customer name and phone number are required.'], 400);
    }

    $productId = isset($data['product_id']) ? (int)$data['product_id'] : (isset($data['productId']) ? (int)$data['productId'] : null);
    $productName = trim($data['product_name'] ?? $data['productName'] ?? 'General Boutique Enquiry');
    $email = trim($data['customer_email'] ?? $data['emailAddress'] ?? $data['email'] ?? '');
    $city = trim($data['city'] ?? '');
    $eventDate = trim($data['event_date'] ?? $data['eventDate'] ?? '');
    $message = trim($data['message'] ?? '');
    $status = 'New';
    $now = date('Y-m-d H:i:s');

    if ($useMySQL) {
        try {
            $sql = "INSERT INTO `enquiries` (product_id, product_name, customer_name, customer_phone, customer_email, city, event_date, message, status, created_at)
                    VALUES (:pid, :pname, :cname, :cphone, :cemail, :city, :edate, :msg, :status, :created_at)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':pid' => $productId,
                ':pname' => $productName,
                ':cname' => $name,
                ':cphone' => $phone,
                ':cemail' => $email,
                ':city' => $city,
                ':edate' => $eventDate,
                ':msg' => $message,
                ':status' => $status,
                ':created_at' => $now
            ]);
            $newId = (int)$pdo->lastInsertId();
        } catch (Exception $e) {}
    }

    // Save to JSON mirror
    $enquiries = getEnquiriesFromJson($jsonFile);
    if (!isset($newId)) {
        $newId = count($enquiries) > 0 ? (int)end($enquiries)['id'] + 1 : 1;
    }

    $newEntry = [
        'id' => $newId,
        'product_id' => $productId,
        'product_name' => $productName,
        'customer_name' => $name,
        'customer_phone' => $phone,
        'customer_email' => $email,
        'city' => $city,
        'event_date' => $eventDate,
        'message' => $message,
        'status' => $status,
        'created_at' => $now
    ];
    array_unshift($enquiries, $newEntry);
    saveEnquiriesToJson($jsonFile, $enquiries);

    sendJsonResponse([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been received. Our boutique master will connect with you on WhatsApp shortly.',
        'enquiry' => $newEntry
    ], 201);
}

// 3. PUT: Update Enquiry Status
if ($method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : (!empty($data['id']) ? (int)$data['id'] : null);
    $status = trim($data['status'] ?? '');

    if (!$id || empty($status)) {
        sendJsonResponse(['success' => false, 'error' => 'Enquiry ID and new status are required.'], 400);
    }

    if ($useMySQL) {
        try {
            $stmt = $pdo->prepare("UPDATE `enquiries` SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
        } catch (Exception $e) {}
    }

    $enquiries = getEnquiriesFromJson($jsonFile);
    foreach ($enquiries as &$e) {
        if ((int)$e['id'] === $id) {
            $e['status'] = $status;
            break;
        }
    }
    saveEnquiriesToJson($jsonFile, $enquiries);

    sendJsonResponse(['success' => true, 'message' => 'Enquiry status updated successfully.']);
}

sendJsonResponse(['success' => false, 'error' => 'Method not supported.'], 405);
