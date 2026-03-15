<?php
/*
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion']);
    exit;
}
mysqli_set_charset($conn, "utf8");

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email manquant']);
    exit;
}

// Vérifier si l'email existe
$stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE Email = ?");
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
    echo json_encode(['success' => false, 'message' => 'Email introuvable']);
    exit;
}

$user = mysqli_fetch_assoc($result);
$userId = $user['id'];

// Générer un code à 6 chiffres
$resetCode = rand(100000, 999999);
$expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes')); // Expire dans 15 min

// Enregistrer le code dans la base de données
$stmt = mysqli_prepare($conn, "INSERT INTO password_resets (user_id, email, reset_code, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE reset_code = ?, expires_at = ?");
mysqli_stmt_bind_param($stmt, "issss", $userId, $email, $resetCode, $expiresAt, $resetCode, $expiresAt);
mysqli_stmt_execute($stmt);

// Envoyer l'email (vous devez configurer PHPMailer ou mail())
$subject = "Code de réinitialisation de mot de passe";
$message = "Votre code de réinitialisation est : $resetCode\n\nCe code expire dans 15 minutes.";
$headers = "From: noreply@votre-site.com";

if (mail($email, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Code envoyé']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur d\'envoi']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);*/
?>