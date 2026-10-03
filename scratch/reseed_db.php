<?php
require_once __DIR__ . '/../config/db.php';

$pdo = Database::getConnection();
if (!$pdo) {
    echo "ERROR: Could not connect to MySQL\n";
    exit(1);
}

echo "Resetting and syncing MySQL database...\n";

// Drop products and recreate
$pdo->exec("DROP TABLE IF EXISTS `products`");
$pdo->exec("DROP TABLE IF EXISTS `home_photos`");

$schemaSql = file_get_contents(__DIR__ . '/../database/schema.sql');
$pdo->exec($schemaSql);
echo "Schema tables created.\n";

// 1. Seed products
$productsJson = json_decode(file_get_contents(__DIR__ . '/../data/products.json'), true);
$pStmt = $pdo->prepare("INSERT INTO `products` 
  (id, name, sku, category, collection, fabric, work, color, occasion, sizes, availability, wholesale, retail, priceVisibility, priceText, image, gallery, description)
  VALUES (:id, :name, :sku, :category, :collection, :fabric, :work, :color, :occasion, :sizes, :availability, :wholesale, :retail, :priceVisibility, :priceText, :image, :gallery, :description)");

foreach ($productsJson as $p) {
    $pStmt->execute([
        ':id' => $p['id'],
        ':name' => $p['name'],
        ':sku' => $p['sku'] ?? ('PMH-' . $p['id']),
        ':category' => $p['category'],
        ':collection' => $p['collection'] ?? $p['category'],
        ':fabric' => $p['fabric'] ?? '',
        ':work' => $p['work'] ?? '',
        ':color' => $p['color'] ?? '',
        ':occasion' => $p['occasion'] ?? '',
        ':sizes' => $p['sizes'] ?? '',
        ':availability' => $p['availability'] ?? 'Available',
        ':wholesale' => !empty($p['wholesale']) ? 1 : 0,
        ':retail' => !empty($p['retail']) ? 1 : 0,
        ':priceVisibility' => $p['priceVisibility'] ?? 'enquiry',
        ':priceText' => $p['priceText'] ?? 'Price on Enquiry',
        ':image' => $p['image'],
        ':gallery' => isset($p['gallery']) ? json_encode($p['gallery']) : json_encode([$p['image']]),
        ':description' => $p['description'] ?? ''
    ]);
}
echo "Seeded " . count($productsJson) . " products into MySQL.\n";

// 2. Seed home photos
$photosJson = json_decode(file_get_contents(__DIR__ . '/../data/home_photos.json'), true);
$hpStmt = $pdo->prepare("INSERT INTO `home_photos` (photo_key, url) VALUES (:k, :u) ON DUPLICATE KEY UPDATE url = VALUES(url)");

foreach ($photosJson as $k => $v) {
    $url = is_array($v) ? ($v['url'] ?? '') : (string)$v;
    $hpStmt->execute([':k' => $k, ':u' => $url]);
}
echo "Seeded " . count($photosJson) . " home photos into MySQL.\n";
echo "SUCCESS!\n";
