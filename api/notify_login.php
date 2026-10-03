<?php
/**
 * Payal Fashion Store - Customer Login Lead & Email Notification API
 * Automatically sends customer login contact number to the store owner's email
 * and persists the leads locally in leads.json for redundancy.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Data storage directory
$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$leadsFile = $dataDir . '/login_leads.json';

// Helper to get raw JSON or form POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!$data && !empty($_POST)) {
    $data = $_POST;
}

if (!$data) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No lead payload provided.'
    ]);
    exit;
}

$phone = isset($data['phone']) ? trim($data['phone']) : '';
$name = !empty($data['name']) ? trim($data['name']) : 'Fashion Store Customer';
$email = !empty($data['email']) ? trim($data['email']) : '';
$ownerEmail = !empty($data['owner_email']) ? trim($data['owner_email']) : 'payalfashionstore@gmail.com';
$loginTime = !empty($data['time']) ? trim($data['time']) : date('d M Y, h:i:s A');
$source = !empty($data['source']) ? trim($data['source']) : 'Customer Portal Login';
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

if (empty($phone)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Phone number is required.'
    ]);
    exit;
}

// Clean phone for tel: and whatsapp:
$cleanPhone = preg_replace('/[^0-9]/', '', $phone);
if (strlen($cleanPhone) === 10) {
    $waPhone = '91' . $cleanPhone;
} elseif (strlen($cleanPhone) === 12 && substr($cleanPhone, 0, 2) === '91') {
    $waPhone = $cleanPhone;
} else {
    $waPhone = $cleanPhone;
}

// Lead object
$leadRecord = [
    'id' => time() . '_' . rand(100, 999),
    'name' => $name,
    'phone' => $phone,
    'cleanPhone' => $cleanPhone,
    'email' => $email,
    'time' => $loginTime,
    'timestamp' => time(),
    'source' => $source,
    'ip' => $ipAddress
];

// 1. Save to local JSON archive
$leads = [];
if (file_exists($leadsFile)) {
    $raw = @file_get_contents($leadsFile);
    $leads = json_decode($raw, true) ?: [];
}
array_unshift($leads, $leadRecord);
// Keep last 500 leads
if (count($leads) > 500) {
    $leads = array_slice($leads, 0, 500);
}
@file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// 2. Append to a human-readable text log
$txtLog = $dataDir . '/login_leads.txt';
$txtEntry = "[" . date('Y-m-d H:i:s') . "] NEW LOGIN LEAD | Name: " . $name . " | Phone: " . $phone . " | Time: " . $loginTime . " | Source: " . $source . "\n";
@file_put_contents($txtLog, $txtEntry, FILE_APPEND);

// 3. Send HTML Email to Store Owner
$subject = "✨ New Customer Login Phone: " . $phone . " — Payal Fashion Store";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Payal Fashion Store <no-reply@payalfashionstore.com>\r\n";
$headers .= "Reply-To: " . ($email ?: "no-reply@payalfashionstore.com") . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$emailHtml = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Customer Login Alert</title>
</head>
<body style="font-family: \'Segoe UI\', Arial, sans-serif; background-color: #FAF7F4; margin: 0; padding: 24px; color: #3A2624;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5D5D0; box-shadow: 0 4px 20px rgba(114,73,71,0.08);">
    <tr>
      <td style="background: linear-gradient(135deg, #5C3A35 0%, #724947 100%); padding: 28px 24px; text-align: center; color: #FFFFFF;">
        <h1 style="margin: 0 0 6px 0; font-size: 24px; letter-spacing: 2px; font-weight: 700;">PAYAL FASHION STORE</h1>
        <p style="margin: 0; font-size: 13px; color: #F5DBD4; letter-spacing: 1px;">INSTANT CUSTOMER LOGIN NOTIFICATION</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 28px;">
        <h2 style="font-size: 18px; color: #5C3A35; margin-top: 0; margin-bottom: 16px;">
          📞 Ek naya customer abhi website pe sign-in / login hua hai!
        </h2>
        <p style="font-size: 14px; line-height: 1.6; color: #554442; margin-bottom: 24px;">
          Customer ne apna mobile number enter kiya hai. Aap niche diye gaye buttons se unhe turant Call ya WhatsApp karke contact kar sakte hain:
        </p>

        <div style="background: #FDF9F7; border: 1.5px dashed #C48E83; border-radius: 10px; padding: 20px; margin-bottom: 26px;">
          <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td width="35%" style="color: #724947; font-weight: 600;">Customer Mobile:</td>
              <td style="font-size: 18px; font-weight: 700; color: #1C6B38;">' . htmlspecialchars($phone) . '</td>
            </tr>
            <tr>
              <td style="color: #724947; font-weight: 600;">Customer Name:</td>
              <td style="color: #2D1D1C; font-weight: 600;">' . htmlspecialchars($name) . '</td>
            </tr>
            ' . (!empty($email) ? '<tr><td style="color: #724947; font-weight: 600;">Email:</td><td>' . htmlspecialchars($email) . '</td></tr>' : '') . '
            <tr>
              <td style="color: #724947; font-weight: 600;">Login Time:</td>
              <td style="color: #665250;">' . htmlspecialchars($loginTime) . '</td>
            </tr>
            <tr>
              <td style="color: #724947; font-weight: 600;">Activity Source:</td>
              <td style="color: #665250;">' . htmlspecialchars($source) . '</td>
            </tr>
          </table>
        </div>

        <!-- Quick Action Buttons -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td align="center" style="padding-right: 8px;">
              <a href="https://wa.me/' . $waPhone . '?text=Namaste!%20Thank%20you%20for%20visiting%20Payal%20Fashion%20Store.%20How%20can%20we%20assist%20you%20with%20our%20bridal%20%26%20festive%20collection?" 
                 target="_blank" 
                 style="display: block; background: #25D366; color: #FFFFFF; text-decoration: none; padding: 13px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; box-shadow: 0 4px 10px rgba(37,211,102,0.25);">
                💬 WhatsApp Chat
              </a>
            </td>
            <td align="center" style="padding-left: 8px;">
              <a href="tel:' . htmlspecialchars($phone) . '" 
                 style="display: block; background: #5C3A35; color: #FFFFFF; text-decoration: none; padding: 13px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; box-shadow: 0 4px 10px rgba(92,58,53,0.25);">
                📞 Call Customer
              </a>
            </td>
          </tr>
        </table>

        <div style="font-size: 12px; color: #8F7876; border-top: 1px solid #EFE4E0; padding-top: 16px; text-align: center;">
          Ye email Payal Fashion Store website se automatically bheja gaya hai taaki owner customer se turant rabta kar sake.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
';

$mailSent = false;
try {
    $mailSent = @mail($ownerEmail, $subject, $emailHtml, $headers);
} catch (Exception $e) {
    $mailSent = false;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Customer contact number logged successfully.',
    'mail_sent' => $mailSent,
    'recipient' => $ownerEmail,
    'lead' => $leadRecord
]);
