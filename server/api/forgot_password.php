<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data  = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email invalide.']);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'Email introuvable. Vérifiez votre adresse.']);
    exit;
}

$reset_code  = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$reset_token = bin2hex(random_bytes(32));
$expires_at  = date('Y-m-d H:i:s', strtotime('+15 minutes'));
$user_id     = $user['id'];

$delStmt = mysqli_prepare($conn, "DELETE FROM password_resets WHERE email = ?");
mysqli_stmt_bind_param($delStmt, "s", $email);
mysqli_stmt_execute($delStmt);
mysqli_stmt_close($delStmt);

$insStmt = mysqli_prepare($conn, "
    INSERT INTO password_resets (user_id, email, reset_code, reset_token, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
");
mysqli_stmt_bind_param($insStmt, "issss", $user_id, $email, $reset_code, $reset_token, $expires_at);
mysqli_stmt_execute($insStmt);
mysqli_stmt_close($insStmt);

echo json_encode([
    'message'   => 'Code généré avec succès.',
    'code_test' => $reset_code
]);
