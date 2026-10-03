<?php
// ============================================================================
// PAYAL FASHION STORE — ADMIN AUTHENTICATION API
// File: api/auth.php
// ============================================================================

require_once dirname(__DIR__) . '/config/db.php';

session_start();

$pdo = Database::getConnection();
$useMySQL = Database::isMySQLAvailable();
$method = $_SERVER['REQUEST_METHOD'];

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;
$action = $_GET['action'] ?? ($data['action'] ?? 'check');

// 1. Check Session Status
if ($action === 'check') {
    if (!empty($_SESSION['pmh_admin_logged_in']) && $_SESSION['pmh_admin_logged_in'] === true) {
        sendJsonResponse([
            'authenticated' => true,
            'username' => $_SESSION['pmh_admin_user'] ?? 'payal',
            'role' => 'owner'
        ]);
    } else {
        sendJsonResponse(['authenticated' => false]);
    }
}

// 2. Admin Login
if ($action === 'login') {
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if (empty($username) || empty($password)) {
        sendJsonResponse(['success' => false, 'error' => 'Username and password are required.'], 400);
    }

    $authenticated = false;

    // Check MySQL admins table first
    if ($useMySQL) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `admins` WHERE username = :u LIMIT 1");
            $stmt->execute([':u' => $username]);
            $admin = $stmt->fetch();
            if ($admin && password_verify($password, $admin['password_hash'])) {
                $authenticated = true;
            }
        } catch (Exception $e) {}
    }

    // Fallback credential check (Default: payal / payal@2026 or from settings.json)
    if (!$authenticated) {
        $settingsFile = APP_ROOT . '/data/settings.json';
        $validUser = 'payal';
        $validPass = 'payal@2026';

        if (file_exists($settingsFile)) {
            $s = json_decode(file_get_contents($settingsFile), true);
            if (!empty($s['admin_username'])) $validUser = $s['admin_username'];
            if (!empty($s['admin_password'])) $validPass = $s['admin_password'];
        }

        if ($username === $validUser && $password === $validPass) {
            $authenticated = true;
        }
    }

    if ($authenticated) {
        $_SESSION['pmh_admin_logged_in'] = true;
        $_SESSION['pmh_admin_user'] = $username;
        $token = bin2hex(random_bytes(24));
        $_SESSION['pmh_admin_token'] = $token;

        sendJsonResponse([
            'success' => true,
            'message' => 'Login successful! Welcome to Payal Fashion Store Admin Console.',
            'token' => $token,
            'username' => $username
        ]);
    } else {
        sendJsonResponse([
            'success' => false,
            'error' => 'Invalid username or password. Please try again.'
        ], 401);
    }
}

// 3. Admin Logout
if ($action === 'logout') {
    unset($_SESSION['pmh_admin_logged_in']);
    unset($_SESSION['pmh_admin_user']);
    unset($_SESSION['pmh_admin_token']);
    session_destroy();
    sendJsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
}

sendJsonResponse(['success' => false, 'error' => 'Invalid action.'], 400);
