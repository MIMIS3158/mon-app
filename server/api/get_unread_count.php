<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["count" => 0]);
    exit;
}
$stmt = mysqli_prepare($conn, "SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND lu = 0");
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);
echo json_encode(["count" => $row['count']]);
mysqli_close($conn);
