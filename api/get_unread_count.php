<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
mysqli_set_charset($conn, "utf8");

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
?>