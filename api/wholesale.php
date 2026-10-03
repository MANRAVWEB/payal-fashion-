<?php
// ============================================================================
// PAYAL FASHION STORE — WHOLESALE & B2B LEADS API
// File: api/wholesale.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$jsonFile = APP_ROOT . '/data/wholesale.json';

function getWholesaleFromJson($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function saveWholesaleToJson($path, $items) {
    file_put_contents($path, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $parsedJson = json_decode($rawInput, true);
    if (!empty($_POST['_method']) && strtoupper($_POST['_method']) === 'PUT') $method = 'PUT';
    if (!empty($parsedJson['_method']) && strtoupper($parsedJson['_method']) === 'PUT') $method = 'PUT';
}

// 1. GET: Fetch Wholesale Leads
if ($method === 'GET') {
    $rows = [];
    $source = 'json_fallback';

    if ($useMySQL && $pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `wholesale_leads` ORDER BY id DESC");
            $rows = $stmt->fetchAll();
            $source = 'mysql';
        } catch (Exception $e) {
            error_log("Wholesale GET MySQL error: " . $e->getMessage());
        }
    }

    if (empty($rows)) {
        $rows = getWholesaleFromJson($jsonFile);
    }

    $normalized = [];
    foreach ($rows as $r) {
        $normalized[] = [
            'id' => $r['id'] ?? null,
            'businessName' => $r['businessName'] ?? ($r['business_name'] ?? 'B2B Partner'),
            'business_name' => $r['business_name'] ?? ($r['businessName'] ?? 'B2B Partner'),
            'customerName' => $r['customerName'] ?? ($r['contact_person'] ?? 'Proprietor'),
            'contact_person' => $r['contact_person'] ?? ($r['customerName'] ?? 'Proprietor'),
            'mobileNumber' => $r['mobileNumber'] ?? ($r['phone'] ?? ''),
            'phone' => $r['phone'] ?? ($r['mobileNumber'] ?? ''),
            'email' => $r['email'] ?? '',
            'city' => $r['city'] ?? '',
            'state' => $r['state'] ?? '',
            'gstin' => $r['gstin'] ?? '',
            'productCategory' => $r['productCategory'] ?? ($r['category'] ?? 'Bridal Lehengas & Sarees'),
            'approxQuantity' => $r['approxQuantity'] ?? ($r['approx_quantity'] ?? '50+ Pcs'),
            'approx_quantity' => $r['approx_quantity'] ?? ($r['approxQuantity'] ?? '50+ Pcs'),
            'message' => $r['message'] ?? '',
            'status' => $r['status'] ?? 'New',
            'date' => $r['date'] ?? ($r['created_at'] ?? date('Y-m-d'))
        ];
    }

    sendJsonResponse(['success' => true, 'source' => $source, 'count' => count($normalized), 'leads' => $normalized], 200);
}

// 2. POST: Submit Wholesale Application
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $businessName = trim($data['business_name'] ?? $data['businessName'] ?? '');
    $contactPerson = trim($data['contact_person'] ?? $data['contactPerson'] ?? $data['customerName'] ?? $data['name'] ?? '');
    $phone = trim($data['phone'] ?? $data['mobileNumber'] ?? $data['customer_phone'] ?? '');

    if (empty($businessName) || empty($contactPerson) || empty($phone)) {
        sendJsonResponse(['success' => false, 'error' => 'Business name, contact person, and phone are required.'], 400);
    }

    $email = trim($data['email'] ?? $data['emailAddress'] ?? '');
    $city = trim($data['city'] ?? '');
    $gstin = trim($data['gstin'] ?? '');
    $qty = trim($data['estimated_order_qty'] ?? $data['approxQuantity'] ?? $data['qty'] ?? '');
    $notes = trim($data['notes'] ?? $data['message'] ?? '');
    $status = 'New';
    $now = date('Y-m-d H:i:s');

    if ($useMySQL) {
        try {
            $sql = "INSERT INTO `wholesale_leads` (business_name, contact_person, phone, email, city, gstin, estimated_order_qty, notes, status, created_at)
                    VALUES (:bname, :cperson, :phone, :email, :city, :gstin, :qty, :notes, :status, :created_at)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':bname' => $businessName,
                ':cperson' => $contactPerson,
                ':phone' => $phone,
                ':email' => $email,
                ':city' => $city,
                ':gstin' => $gstin,
                ':qty' => $qty,
                ':notes' => $notes,
                ':status' => $status,
                ':created_at' => $now
            ]);
            $newId = (int)$pdo->lastInsertId();
        } catch (Exception $e) {}
    }

    $leads = getWholesaleFromJson($jsonFile);
    if (!isset($newId)) {
        $newId = count($leads) > 0 ? (int)end($leads)['id'] + 1 : 1;
    }

    $newLead = [
        'id' => $newId,
        'business_name' => $businessName,
        'contact_person' => $contactPerson,
        'phone' => $phone,
        'email' => $email,
        'city' => $city,
        'gstin' => $gstin,
        'estimated_order_qty' => $qty,
        'notes' => $notes,
        'status' => $status,
        'created_at' => $now
    ];
    array_unshift($leads, $newLead);
    saveWholesaleToJson($jsonFile, $leads);

    sendJsonResponse([
        'success' => true,
        'message' => 'Combo Set enquiry submitted successfully! Our styling team will send the catalog on WhatsApp.',
        'lead' => $newLead
    ], 201);
}

// 3. PUT: Update Status
if ($method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : (!empty($data['id']) ? (int)$data['id'] : null);
    $status = trim($data['status'] ?? '');

    if (!$id || empty($status)) {
        sendJsonResponse(['success' => false, 'error' => 'Lead ID and status are required.'], 400);
    }

    if ($useMySQL) {
        try {
            $stmt = $pdo->prepare("UPDATE `wholesale_leads` SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);
        } catch (Exception $e) {}
    }

    $leads = getWholesaleFromJson($jsonFile);
    foreach ($leads as &$l) {
        if ((int)$l['id'] === $id) {
            $l['status'] = $status;
            break;
        }
    }
    saveWholesaleToJson($jsonFile, $leads);

    sendJsonResponse(['success' => true, 'message' => 'Combo Set lead updated.']);
}

sendJsonResponse(['success' => false, 'error' => 'Method not supported.'], 405);
