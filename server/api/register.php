<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Données invalides"]);
    exit;
}

$nom = $data['nom'] ?? null;
$prenom = $data['prenom'] ?? null;
$email = $data['email'] ?? null;
$plainPassword = $data['password'] ?? null;
$role = $data['role'] ?? null;

if (!$nom || !$prenom || !$email || !$plainPassword || !$role) {
    http_response_code(400);
    echo json_encode(["error" => "Champs obligatoires manquants"]);
    exit;
}

if (!in_array($role, ['developer', 'entrepreneur'], true)) {
    http_response_code(400);
    echo json_encode(["error" => "Rôle invalide"]);
    exit;
}

$password = password_hash($plainPassword, PASSWORD_DEFAULT);

mysqli_begin_transaction($conn);

try {
    $stmt = $conn->prepare("INSERT INTO users (Nom, Prenom, Email, Password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssss",
        $nom,
        $prenom,
        $email,
        $password,
        $role
    );

    if (!$stmt->execute()) {
        throw new Exception("Erreur inscription utilisateur");
    }

    $userId = (int) $conn->insert_id;
    $stmt->close();

    if ($role === 'developer') {
        $devStmt = $conn->prepare(
            "INSERT INTO developers (user_id, Nomdev, Prenomdev, Emaildev) VALUES (?, ?, ?, ?)"
        );
        $devStmt->bind_param("isss", $userId, $nom, $prenom, $email);

        if (!$devStmt->execute()) {
            throw new Exception("Erreur création profil développeur");
        }

        $devStmt->close();
    }

    if ($role === 'entrepreneur') {
        $entStmt = $conn->prepare(
            "INSERT INTO entrepreneurs (user_id, Nom, Prenom, Email) VALUES (?, ?, ?, ?)"
        );
        $entStmt->bind_param("isss", $userId, $nom, $prenom, $email);

        if (!$entStmt->execute()) {
            throw new Exception("Erreur création profil entrepreneur");
        }

        $entStmt->close();
    }

    mysqli_commit($conn);

    echo json_encode([
        "success" => true,
        "role" => $role,
        "id" => (string) $userId
    ]);
} /*catch (Exception $e) {
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}*/
catch (Exception $e) {
    mysqli_rollback($conn);
    http_response_code(500);
    error_log($e->getMessage());
    echo json_encode(["error" => "Une erreur est survenue lors de l'inscription"]);
}

$conn->close();