<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data  = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$code  = trim($data['code']  ?? '');
if (!$email || !$code) {
    http_response_code(400);
    echo json_encode(['message' => 'Données manquantes.']);
    exit;
}
$email_safe = mysqli_real_escape_string($conn, $email);
$code_safe  = mysqli_real_escape_string($conn, $code);
$result = mysqli_query($conn, "
    SELECT reset_token, expires_at
    FROM password_resets
    WHERE email = '$email_safe' AND reset_code = '$code_safe'
    ORDER BY created_at DESC
    LIMIT 1
");
$row = mysqli_fetch_assoc($result);
if (!$row) {
    http_response_code(400);
    echo json_encode(['message' => 'Code incorrect.']);
    exit;
}
if (strtotime($row['expires_at']) < time()) {
    mysqli_query($conn, "DELETE FROM password_resets WHERE email = '$email_safe'");
    http_response_code(400);
    echo json_encode(['message' => 'Code expiré. Veuillez recommencer.']);
    exit;
}
echo json_encode([
    'message'     => 'Code vérifié avec succès.',
    'reset_token' => $row['reset_token']
]);
