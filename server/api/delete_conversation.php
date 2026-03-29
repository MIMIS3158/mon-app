<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id    = $_GET['user_id'] ?? null;
$contact_id = $_GET['contact_id'] ?? null;
if (!$user_id || !$contact_id) {
    http_response_code(400);
    echo json_encode(["error" => "Paramètres manquants"]);
    exit;
}
$stmt = mysqli_prepare($conn, "
    DELETE FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
");
mysqli_stmt_bind_param(
    $stmt,
    "iiii",
    $user_id,
    $contact_id,
    $contact_id,
    $user_id
);
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
   // echo json_encode(["error" => mysqli_error($conn)]);
   error_log(mysqli_error($conn));
echo json_encode(["error" => "Une erreur est survenue lors de la suppression"]);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
