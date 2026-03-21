<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
$conn = mysqli_connect("localhost", "root", "", "freelance_db");
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Connexion BDD échouée"]);
    exit;
}
mysqli_set_charset($conn, "utf8");
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $sender_id   = $_GET['sender_id'] ?? null;
    $receiver_id = $_GET['receiver_id'] ?? null;
    if (!$sender_id || !$receiver_id) {
        echo json_encode([]);
        exit;
    }
    $stmt = mysqli_prepare($conn, "
        SELECT m.*,
               u1.Nom as sender_nom,
               u2.Nom as receiver_nom
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        JOIN users u2 ON m.receiver_id = u2.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.date_envoi ASC
    ");
    mysqli_stmt_bind_param($stmt, "iiii", $sender_id, $receiver_id, $receiver_id, $sender_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $messages = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $messages[] = $row;
    }
    mysqli_stmt_close($stmt);
    $update = mysqli_prepare($conn, "
        UPDATE messages SET lu = 1 
        WHERE receiver_id = ? AND sender_id = ? AND lu = 0
    ");
    mysqli_stmt_bind_param($update, "ii", $sender_id, $receiver_id);
    mysqli_stmt_execute($update);
    mysqli_stmt_close($update);
    echo json_encode($messages);
} elseif ($method === 'POST') {
    $data        = json_decode(file_get_contents("php://input"), true);
    $sender_id   = $data['sender_id'] ?? null;
    $receiver_id = $data['receiver_id'] ?? null;
    $project_id  = $data['project_id'] ?? null;
    $message     = trim($data['message'] ?? '');
    if (!$sender_id || !$receiver_id || $message === '') {
        http_response_code(400);
        echo json_encode(["error" => "Données manquantes ou message vide"]);
        exit;
    }
    $checkUser = mysqli_prepare($conn, "SELECT id FROM users WHERE id = ?");
    mysqli_stmt_bind_param($checkUser, "i", $sender_id);
    mysqli_stmt_execute($checkUser);
    mysqli_stmt_store_result($checkUser);
    if (mysqli_stmt_num_rows($checkUser) === 0) {
        http_response_code(400);
        echo json_encode(["error" => "sender_id invalide"]);
        exit;
    }
    mysqli_stmt_close($checkUser);
    $checkUser = mysqli_prepare($conn, "SELECT id FROM users WHERE id = ?");
    mysqli_stmt_bind_param($checkUser, "i", $receiver_id);
    mysqli_stmt_execute($checkUser);
    mysqli_stmt_store_result($checkUser);
    if (mysqli_stmt_num_rows($checkUser) === 0) {
        http_response_code(400);
        echo json_encode(["error" => "receiver_id invalide"]);
        exit;
    }
    mysqli_stmt_close($checkUser);
    if (empty($project_id) || $project_id == 0) $project_id = null;
    if ($project_id === null) {
        $stmt = mysqli_prepare($conn, "
            INSERT INTO messages (sender_id, receiver_id, project_id, message, date_envoi, lu)
            VALUES (?, ?, NULL, ?, NOW(), 0)
        ");
        mysqli_stmt_bind_param($stmt, "iis", $sender_id, $receiver_id, $message);
    } else {
        $stmt = mysqli_prepare($conn, "
            INSERT INTO messages (sender_id, receiver_id, project_id, message, date_envoi, lu)
            VALUES (?, ?, ?, ?, NOW(), 0)
        ");
        mysqli_stmt_bind_param($stmt, "iiis", $sender_id, $receiver_id, $project_id, $message);
    }
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "message" => "Message envoyé"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);
?>