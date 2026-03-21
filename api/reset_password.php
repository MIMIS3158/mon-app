<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
$conn = new mysqli('localhost', 'root', '', 'freelance_db');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur connexion BDD.']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$reset_token = trim($data['reset_token'] ?? '');
$password    = trim($data['password'] ?? '');
if (!$reset_token || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Données manquantes.']);
    exit;
}
if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['message' => 'Le mot de passe doit contenir au moins 8 caractères.']);
    exit;
}
$stmt = $conn->prepare("SELECT user_id, expires_at FROM password_resets WHERE reset_token = ? LIMIT 1");
$stmt->bind_param('s', $reset_token);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
if (!$row) {
    http_response_code(400);
    echo json_encode(['message' => 'Token invalide ou déjà utilisé.']);
    exit;
}
if (strtotime($row['expires_at']) < time()) {
    $conn->query("DELETE FROM password_resets WHERE reset_token = '$reset_token'");
    http_response_code(400);
    echo json_encode(['message' => 'Token expiré. Veuillez recommencer.']);
    exit;
}
$hashed  = password_hash($password, PASSWORD_BCRYPT);
$user_id = $row['user_id'];
$stmt2 = $conn->prepare("UPDATE users SET Password = ? WHERE id = ?");
$stmt2->bind_param('si', $hashed, $user_id);
$stmt2->execute();
$conn->query("DELETE FROM password_resets WHERE reset_token = '$reset_token'");
$stmt3 = $conn->prepare("SELECT id, role, Nom, Prenom, photo FROM users WHERE id = ? LIMIT 1");
$stmt3->bind_param('i', $user_id);
$stmt3->execute();
$user = $stmt3->get_result()->fetch_assoc();
echo json_encode([
    'token' => 'token-' . time(),
    'user'  => [
        'id'     => (string)$user['id'],
        'role'   => $user['role'],
        'nom'    => $user['Nom'],
        'prenom' => $user['Prenom'],
        'photo'  => $user['photo']
    ]
]);
$conn->close();
?>