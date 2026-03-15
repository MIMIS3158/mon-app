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
$code = $data['code'] ?? null;

if (!$email || !$code) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

// Vérifier le code et son expiration
$stmt = mysqli_prepare($conn, "SELECT * FROM password_resets WHERE email = ? AND reset_code = ? AND expires_at > NOW()");
mysqli_stmt_bind_param($stmt, "ss", $email, $code);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {
    // Générer un token de sécurité
    $token = bin2hex(random_bytes(32));
    
    // Mettre à jour le token
    $stmt = mysqli_prepare($conn, "UPDATE password_resets SET reset_token = ? WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "ss", $token, $email);
    mysqli_stmt_execute($stmt);
    
    echo json_encode(['success' => true, 'token' => $token]);
} else {
    echo json_encode(['success' => false, 'message' => 'Code invalide ou expiré']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>