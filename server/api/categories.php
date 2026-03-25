<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();


$result = mysqli_query($conn, "SELECT * FROM categories ORDER BY nom_categorie ASC");
$categories = [];
while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = $row;
}
echo json_encode($categories);
mysqli_close($conn);
