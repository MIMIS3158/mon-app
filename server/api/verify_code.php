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

$stmt = mysqli_prepare($conn, "
    SELECT reset_token, expires_at
    FROM password_resets
    WHERE email = ? AND reset_code = ?
    ORDER BY created_at DESC
    LIMIT 1
");
mysqli_stmt_bind_param($stmt, "ss", $email, $code);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$row) {
    http_response_code(400);
    echo json_encode(['message' => 'Code incorrect.']);
    exit;
}

if (strtotime($row['expires_at']) < time()) {
    $delStmt = mysqli_prepare($conn, "DELETE FROM password_resets WHERE email = ?");
    mysqli_stmt_bind_param($delStmt, "s", $email);
    mysqli_stmt_execute($delStmt);
    mysqli_stmt_close($delStmt);
    http_response_code(400);
    echo json_encode(['message' => 'Code expiré. Veuillez recommencer.']);
    exit;
}

echo json_encode([
    'message'     => 'Code vérifié avec succès.',
    'reset_token' => $row['reset_token']
]);
