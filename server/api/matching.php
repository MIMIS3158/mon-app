<?php
/*
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$result = mysqli_query($conn, "
    SELECT d.Nomdev, d.Prenomdev, d.CompetencesTechniques, d.Niveau,
           COALESCE(AVG(e.note), 0) as moyenne_note
    FROM developers d
    LEFT JOIN evaluations e ON e.id_evalue = d.user_id
    GROUP BY d.id
    ORDER BY moyenne_note DESC
    LIMIT 3
");

$top3 = [];
while ($row = mysqli_fetch_assoc($result)) {
    $top3[] = [
        'nom' => $row['Prenomdev'] . ' ' . $row['Nomdev'],
       // 'score' => min(99, 70 + ($row['moyenne_note'] * 5) + ($row['nb_projets'] * 2)),
       'score' => min(99, 70 + ($row['moyenne_note'] * 5)),
        'note' => round($row['moyenne_note'], 1),
        'raison' => 'Compétences : ' . ($row['CompetencesTechniques'] ?? 'Non spécifiées') . ' · Niveau : ' . ($row['Niveau'] ?? 'Non spécifié')
    ];
}

echo json_encode(['top3' => $top3]);

mysqli_close($conn);*/

error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$result = mysqli_query($conn, "
    SELECT d.user_id, d.Nomdev, d.Prenomdev, d.CompetencesTechniques, d.Niveau,d.profileImage,
           COALESCE(AVG(e.note), 0) as moyenne_note
    FROM developers d
    LEFT JOIN evaluations e ON e.id_evalue = d.user_id
    GROUP BY d.id
    ORDER BY moyenne_note DESC
    LIMIT 3
");

$top3 = [];
while ($row = mysqli_fetch_assoc($result)) {
    $top3[] = [
        'nom'     => $row['Prenomdev'] . ' ' . $row['Nomdev'],
        'score'   => min(99, 70 + ($row['moyenne_note'] * 5)),
        'note'    => round($row['moyenne_note'], 1),
        'raison'  => 'Compétences : ' . ($row['CompetencesTechniques'] ?? 'Non spécifiées') . ' · Niveau : ' . ($row['Niveau'] ?? 'Non spécifié'),
        'photo' => $row['profileImage'] ? 'http://localhost:8000/' . $row['profileImage'] : null,
        'user_id' => $row['user_id']
    ];
}

echo json_encode(['top3' => $top3]);
mysqli_close($conn);

?>