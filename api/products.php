<?php
// ============================================================================
// PAYAL FASHION STORE — PRODUCTS REST API
// File: api/products.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$jsonFile = APP_ROOT . '/data/products.json';

function getProductsFromJson($filePath) {
    if (!file_exists($filePath)) return [];
    $data = json_decode(file_get_contents($filePath), true);
    return is_array($data) ? $data : [];
}

function saveProductsToJson($filePath, $products) {
    file_put_contents($filePath, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle POST spoofing for PUT/DELETE
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $parsedJson = json_decode($rawInput, true);
    if (!empty($_POST['_method'])) {
        $method = strtoupper($_POST['_method']);
    } elseif (!empty($parsedJson['_method'])) {
        $method = strtoupper($parsedJson['_method']);
    } elseif (!empty($_GET['action'])) {
        if ($_GET['action'] === 'delete') $method = 'DELETE';
        if ($_GET['action'] === 'update') $method = 'PUT';
    }
}

// ----------------------------------------------------------------------------
// 1. GET: Fetch Products
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $category = isset($_GET['category']) ? trim($_GET['category']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;

    if ($useMySQL) {
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM `products` WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => $id]);
                $item = $stmt->fetch();
                if (!$item) {
                    sendJsonResponse(['success' => false, 'error' => 'Product not found'], 404);
                }
                if ($item['gallery'] && is_string($item['gallery'])) {
                    $item['gallery'] = json_decode($item['gallery'], true);
                }
                $item['wholesale'] = (bool)$item['wholesale'];
                $item['retail'] = (bool)$item['retail'];
                sendJsonResponse(['success' => true, 'source' => 'mysql', 'product' => $item]);
            }

            $sql = "SELECT * FROM `products` WHERE 1=1";
            $params = [];

            if ($category && $category !== 'All') {
                $sql .= " AND (category = :cat OR collection = :cat)";
                $params[':cat'] = $category;
            }

            if ($search) {
                $sql .= " AND (name LIKE :q OR fabric LIKE :q OR work LIKE :q OR color LIKE :q OR occasion LIKE :q)";
                $params[':q'] = "%$search%";
            }

            $sql .= " ORDER BY id ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            foreach ($rows as &$r) {
                if (!empty($r['gallery']) && is_string($r['gallery'])) {
                    $r['gallery'] = json_decode($r['gallery'], true);
                }
                $r['wholesale'] = (bool)$r['wholesale'];
                $r['retail'] = (bool)$r['retail'];
            }

            sendJsonResponse([
                'success' => true,
                'source' => 'mysql',
                'count' => count($rows),
                'products' => $rows
            ]);
        } catch (Exception $e) {}
    }

    // JSON Fallback
    $products = getProductsFromJson($jsonFile);
    if ($id) {
        $found = null;
        foreach ($products as $p) {
            if ((int)$p['id'] === $id) { $found = $p; break; }
        }
        if (!$found) sendJsonResponse(['success' => false, 'error' => 'Product not found'], 404);
        sendJsonResponse(['success' => true, 'source' => 'json_fallback', 'product' => $found]);
    }

    if ($category && $category !== 'All') {
        $products = array_values(array_filter($products, function($p) use ($category) {
            return ($p['category'] ?? '') === $category || ($p['collection'] ?? '') === $category;
        }));
    }

    if ($search) {
        $q = mb_strtolower($search);
        $products = array_values(array_filter($products, function($p) use ($q) {
            $blob = mb_strtolower(($p['name'] ?? '') . ' ' . ($p['fabric'] ?? '') . ' ' . ($p['work'] ?? '') . ' ' . ($p['color'] ?? '') . ' ' . ($p['occasion'] ?? ''));
            return mb_strpos($blob, $q) !== false;
        }));
    }

    sendJsonResponse([
        'success' => true,
        'source' => 'json_fallback',
        'count' => count($products),
        'products' => array_values($products)
    ]);
}

// ----------------------------------------------------------------------------
// 2. POST: Create or bulk update Product
// ----------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    // Handle bulk products array if submitted via CloudSync
    if (isset($data['products']) && is_array($data['products'])) {
        saveProductsToJson($jsonFile, $data['products']);
        sendJsonResponse(['success' => true, 'message' => 'Products catalogue synced successfully!']);
    }

    $name = trim($data['name'] ?? $data['title'] ?? '');
    $category = trim($data['category'] ?? 'Bridal Lehengas');

    if (empty($name)) {
        sendJsonResponse(['success' => false, 'error' => 'Product name is required.'], 400);
    }

    $sku = trim($data['sku'] ?? ('PMH-' . time()));
    $collection = trim($data['collection'] ?? $category);
    $fabric = trim($data['fabric'] ?? 'Heritage Silk');
    $work = trim($data['work'] ?? 'Handcrafted Zardozi');
    $color = trim($data['color'] ?? '');
    $occasion = trim($data['occasion'] ?? '');
    $sizes = trim($data['sizes'] ?? 'Semi-stitched');
    $availability = trim($data['availability'] ?? $data['status'] ?? 'Available');
    $wholesale = !empty($data['wholesale']) ? 1 : 0;
    $retail = !empty($data['retail']) ? 1 : 0;
    $priceVisibility = trim($data['priceVisibility'] ?? 'enquiry');
    $priceText = trim($data['priceText'] ?? 'Price on Enquiry');
    $image = trim($data['image'] ?? 'assets/images/collection-bridal.jpg');
    $gallery = isset($data['gallery']) ? (is_array($data['gallery']) ? json_encode($data['gallery']) : $data['gallery']) : json_encode([$image]);
    $description = trim($data['description'] ?? '');

    if ($useMySQL) {
        try {
            $sql = "INSERT INTO `products` 
                    (name, sku, category, collection, fabric, work, color, occasion, sizes, availability, wholesale, retail, priceVisibility, priceText, image, gallery, description)
                    VALUES (:name, :sku, :category, :collection, :fabric, :work, :color, :occasion, :sizes, :availability, :wholesale, :retail, :priceVisibility, :priceText, :image, :gallery, :description)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':name' => $name,
                ':sku' => $sku,
                ':category' => $category,
                ':collection' => $collection,
                ':fabric' => $fabric,
                ':work' => $work,
                ':color' => $color,
                ':occasion' => $occasion,
                ':sizes' => $sizes,
                ':availability' => $availability,
                ':wholesale' => $wholesale,
                ':retail' => $retail,
                ':priceVisibility' => $priceVisibility,
                ':priceText' => $priceText,
                ':image' => $image,
                ':gallery' => $gallery,
                ':description' => $description
            ]);
            $newId = (int)$pdo->lastInsertId();
        } catch (Exception $e) {}
    }

    $products = getProductsFromJson($jsonFile);
    if (!isset($newId)) {
        $maxId = 0;
        foreach ($products as $p) {
            if (!empty($p['id']) && $p['id'] > $maxId) $maxId = (int)$p['id'];
        }
        $newId = $maxId + 1;
    }

    $newProd = [
        'id' => $newId,
        'name' => $name,
        'sku' => $sku,
        'category' => $category,
        'collection' => $collection,
        'fabric' => $fabric,
        'work' => $work,
        'color' => $color,
        'occasion' => $occasion,
        'sizes' => $sizes,
        'availability' => $availability,
        'wholesale' => (bool)$wholesale,
        'retail' => (bool)$retail,
        'priceVisibility' => $priceVisibility,
        'priceText' => $priceText,
        'image' => $image,
        'gallery' => is_string($gallery) ? json_decode($gallery, true) : $gallery,
        'description' => $description
    ];
    $products[] = $newProd;
    saveProductsToJson($jsonFile, $products);

    sendJsonResponse([
        'success' => true,
        'message' => 'Product created successfully!',
        'id' => $newId,
        'product' => $newProd
    ], 201);
}

// ----------------------------------------------------------------------------
// 3. PUT: Update Product
// ----------------------------------------------------------------------------
if ($method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : (!empty($data['id']) ? (int)$data['id'] : null);

    if (!$id) {
        sendJsonResponse(['success' => false, 'error' => 'Product ID is required for update.'], 400);
    }

    if ($useMySQL) {
        try {
            $allowed = ['name', 'sku', 'category', 'collection', 'fabric', 'work', 'color', 'occasion', 'sizes', 'availability', 'wholesale', 'retail', 'priceVisibility', 'priceText', 'image', 'gallery', 'description'];
            $fields = [];
            $params = [':id' => $id];

            foreach ($allowed as $f) {
                if (isset($data[$f])) {
                    $fields[] = "`$f` = :$f";
                    if ($f === 'gallery' && is_array($data[$f])) {
                        $params[":$f"] = json_encode($data[$f]);
                    } elseif ($f === 'wholesale' || $f === 'retail') {
                        $params[":$f"] = !empty($data[$f]) ? 1 : 0;
                    } else {
                        $params[":$f"] = $data[$f];
                    }
                }
            }

            if (!empty($fields)) {
                $sql = "UPDATE `products` SET " . implode(', ', $fields) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
        } catch (Exception $e) {}
    }

    $products = getProductsFromJson($jsonFile);
    foreach ($products as &$p) {
        if ((int)$p['id'] === $id) {
            $p = array_merge($p, $data);
            break;
        }
    }
    saveProductsToJson($jsonFile, $products);

    sendJsonResponse(['success' => true, 'message' => 'Product updated successfully!']);
}

// ----------------------------------------------------------------------------
// 4. DELETE: Remove Product
// ----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    if (!$id) {
        $raw = file_get_contents('php://input');
        $d = json_decode($raw, true);
        if (!empty($d['id'])) $id = (int)$d['id'];
    }

    if (!$id) {
        sendJsonResponse(['success' => false, 'error' => 'Product ID is required.'], 400);
    }

    if ($useMySQL) {
        try {
            $stmt = $pdo->prepare("DELETE FROM `products` WHERE id = :id");
            $stmt->execute([':id' => $id]);
        } catch (Exception $e) {}
    }

    $products = getProductsFromJson($jsonFile);
    $products = array_values(array_filter($products, function($p) use ($id) {
        return (int)$p['id'] !== $id;
    }));
    saveProductsToJson($jsonFile, $products);

    sendJsonResponse(['success' => true, 'message' => 'Product deleted successfully.']);
}

sendJsonResponse(['success' => false, 'error' => 'Method not supported.'], 405);
