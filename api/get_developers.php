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
        d.id,
        d.Nomdev,
        d.Prenomdev,
        d.CompetencesTechniques,
        d.Experience,
        d.Niveau,
        d.Ville,
        d.Pays,
        d.Github,
        d.portfolio as Portfolio,
        d.profileImage as photo,
        ROUND(AVG(e.note), 1) as moyenneNote
    FROM developers d
    LEFT JOIN evaluations e ON e.id_evalue = d.id 
        AND e.type_evaluateur = 'entrepreneur'
    GROUP BY d.id
    ORDER BY d.id DESC
");
$developers = [];
while ($row = mysqli_fetch_assoc($result)) {
    if (!empty($row['photo'])) {
        $row['photo'] = 'http://localhost/myApp/api/' . $row['photo'];
    }
    if (!empty($row['Portfolio'])) {
        $row['Portfolio'] = 'http://localhost/myApp/api/' . $row['Portfolio'];
    }
    $row['moyenneNote'] = $row['moyenneNote'] ? (float)$row['moyenneNote'] : null;
    $developers[] = $row;
}
echo json_encode($developers);
mysqli_close($conn);
?>