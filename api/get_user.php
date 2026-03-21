<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
mysqli_set_charset($conn, "utf8");
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$stmt = mysqli_prepare($conn, "SELECT id, Nom, Prenom, photo FROM users WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
if ($user && !empty($user['photo'])) {
    $user['photo'] = 'http://localhost/myApp/api/' . $user['photo'];
}
echo json_encode($user ?: ['error' => 'Introuvable']);
mysqli_close($conn);
?>