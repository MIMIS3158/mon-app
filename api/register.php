<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "freelance_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);
$password = password_hash($data['Password'], PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (Nom, Prenom, Email, Password, role) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss",
    $data['Nom'],
    $data['Prenom'],
    $data['Email'],
    $password,
    $data['role']
);
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "role" => $data['role'],
        "id" => (string)$conn->insert_id
    ]);
}else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur inscription"]);
}
$conn->close();
?>