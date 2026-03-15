<?php
/*
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
if (!$conn) {
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}
mysqli_set_charset($conn, "utf8");

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id === 0) {
    echo json_encode(['error' => 'ID manquant']);
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT id, Nom, Prenom FROM users WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

echo json_encode($user ?: ['error' => 'Introuvable']);
mysqli_close($conn);*/

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