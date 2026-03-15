<?php
/*header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "freelance_db");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['Email'];
$password = $data['Password'];

$stmt = $conn->prepare("SELECT id, Email, Password, role FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['Password'])) {
    echo json_encode([
        "token" => "token-" . time(),
        "user" => [
            "id"   => $user['id'],
            "role" => $user['role']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
}

$stmt->close();
$conn->close();*/

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
$stmt = $conn->prepare("SELECT id, Email, Password, role FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
if ($user && password_verify($password, $user['Password'])) {
    echo json_encode([
        "token" => "token-" . time(),
        "user" => [
             "id"   => (string)$user['id'],  
            "role" => $user['role']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
}

$conn->close();
?>
