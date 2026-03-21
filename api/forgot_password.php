<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
$conn = mysqli_connect('localhost', 'root', '', 'freelance_db');
if (!$conn) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur connexion BDD.']);
    exit;
}
$data  = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email invalide.']);
    exit;
}
$email_safe = mysqli_real_escape_string($conn, $email);
$result = mysqli_query($conn, "SELECT id FROM users WHERE email = '$email_safe' LIMIT 1");
$user   = mysqli_fetch_assoc($result);
if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'Email introuvable. Vérifiez votre adresse.']);
    exit;
}
$reset_code  = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$reset_token = bin2hex(random_bytes(32));
$expires_at  = date('Y-m-d H:i:s', strtotime('+15 minutes'));
$user_id     = $user['id'];
mysqli_query($conn, "DELETE FROM password_resets WHERE email = '$email_safe'");
mysqli_query($conn, "
    INSERT INTO password_resets (user_id, email, reset_code, reset_token, expires_at, created_at)
    VALUES ('$user_id', '$email_safe', '$reset_code', '$reset_token', '$expires_at', NOW())
");
echo json_encode([
    'message'   => 'Code généré avec succès.',
    'code_test' => $reset_code
]);
?>