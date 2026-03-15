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

$result = mysqli_query($conn, "
    SELECT 
        id,
        Nomdev,
        Prenomdev,
        CompetencesTechniques,
        Experience,
        Niveau,
        Ville,
        Pays,
        Github,
        portfolio as Portfolio,
        profileImage as photo
    FROM developers
    ORDER BY id DESC
");

$developers = [];
while ($row = mysqli_fetch_assoc($result)) {
    if (!empty($row['photo'])) {
        $row['photo'] = 'http://localhost/myApp/api/' . $row['photo'];
    }
    if (!empty($row['Portfolio'])) {
        $row['Portfolio'] = 'http://localhost/myApp/api/' . $row['Portfolio'];
    }
    $developers[] = $row;
}

echo json_encode($developers);
mysqli_close($conn);
?>