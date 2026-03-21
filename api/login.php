<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "freelance_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['Email'];
$password = $data['Password'];
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
?>