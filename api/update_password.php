<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
mysqli_set_charset($conn, "utf8");

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$token = $data['token'] ?? null;
$newPassword = $data['new_password'] ?? null;

if (!$email || !$token || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

// Vérifier le token
$stmt = mysqli_prepare($conn, "SELECT user_id FROM password_resets WHERE email = ? AND reset_token = ?");
mysqli_stmt_bind_param($stmt, "ss", $email, $token);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(['success' => false, 'message' => 'Token invalide']);
    exit;
}

$row = mysqli_fetch_assoc($result);
$userId = $row['user_id'];

// Hasher le nouveau mot de passe
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Mettre à jour le mot de passe
$stmt = mysqli_prepare($conn, "UPDATE users SET Password = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "si", $hashedPassword, $userId);
mysqli_stmt_execute($stmt);

// Supprimer le code de réinitialisation
$stmt = mysqli_prepare($conn, "DELETE FROM password_resets WHERE email = ?");
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);

echo json_encode(['success' => true, 'message' => 'Mot de passe mis à jour']);

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>