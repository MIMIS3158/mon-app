<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];
$stmt = $conn->prepare("SELECT id, Email, Password, role, Nom, Prenom, photo FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
if ($user && password_verify($password, $user['Password'])) {
    echo json_encode([
        "token" => "token-" . time(),
        "user" => [
            "id"     => (string)$user['id'],
            "role"   => $user['role'],
            "nom"    => $user['Nom'],
            "prenom" => $user['Prenom'],
            "photo"  => $user['photo']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
}
$conn->close();
