<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

$user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
if ($user && !empty($user['photo'])) {
    $user['photo'] = 'http://localhost:8000/' . $user['photo'];
}
echo json_encode($user ?: ['error' => 'Introuvable']);
mysqli_close($conn);