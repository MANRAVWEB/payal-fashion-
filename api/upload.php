<?php
// ============================================================================
// PAYAL FASHION STORE — IMAGE UPLOAD API
// File: api/upload.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Only POST requests are allowed.'], 405);
}

// Check if a file was uploaded
$file = $_FILES['file'] ?? $_FILES['image'] ?? null;

if (!$file || !isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
    $errCode = $file['error'] ?? 'NO_FILE';
    sendJsonResponse([
        'success' => false,
        'error' => 'No file uploaded or upload error occurred (Code: ' . $errCode . ')'
    ], 400);
}

// Validate file size (Max 15MB)
$maxBytes = 15 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    sendJsonResponse(['success' => false, 'error' => 'File size exceeds maximum 15MB limit.'], 400);
}

// Validate image MIME type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif'
];

if (!isset($allowedMimes[$mime])) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid file format. Only JPG, PNG, WEBP and GIF are allowed.'], 400);
}

$ext = $allowedMimes[$mime];

// Generate unique clean filename
$prefix = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$prefix = substr($prefix, 0, 30);
$filename = 'payal_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

$uploadDir = APP_ROOT . '/uploads';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    sendJsonResponse(['success' => false, 'error' => 'Failed to save uploaded file to server destination.'], 500);
}

$publicUrl = 'uploads/' . $filename;

sendJsonResponse([
    'success' => true,
    'message' => 'Image uploaded successfully!',
    'url' => $publicUrl,
    'filename' => $filename,
    'size_kb' => round($file['size'] / 1024, 1),
    'mime' => $mime
], 201);
