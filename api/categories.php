<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
$result = mysqli_query($conn, "SELECT * FROM categories ORDER BY nom_categorie ASC");
$categories = [];
while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = $row;
}
echo json_encode($categories);
mysqli_close($conn);
?>