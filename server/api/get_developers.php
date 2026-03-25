<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();


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
        $row['photo'] = 'http://localhost:8000/api/' . $row['photo'];
    }
    if (!empty($row['Portfolio'])) {
        $row['Portfolio'] = 'http://localhost:8000/api/' . $row['Portfolio'];
    }
    $row['moyenneNote'] = $row['moyenneNote'] ? (float)$row['moyenneNote'] : null;
    $developers[] = $row;
}
echo json_encode($developers);
mysqli_close($conn);
