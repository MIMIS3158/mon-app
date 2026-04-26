<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id = $_GET['userId'] ?? null;
$eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
mysqli_stmt_bind_param($eStmt, "i", $user_id);
mysqli_stmt_execute($eStmt);
mysqli_stmt_bind_result($eStmt, $entrepreneur_id);
mysqli_stmt_fetch($eStmt);
mysqli_stmt_close($eStmt);

if (!$entrepreneur_id) {
    echo json_encode([]);
    exit;
}
$stmt = mysqli_prepare($conn, "
    SELECT 
        c.id,
        c.project_id,
        c.developpeur_id,
        d.user_id as developpeur_user_id,
        d.Nomdev,
        d.Prenomdev,
        p.Nomduprojet,
        c.message as messagePostulation,
        c.budget_propose as Budget,
        c.duree_estimee as Duree,
        c.statut,
        c.date_postulation,
        c.developpeur_evalue as developpeurEvalue
    FROM candidatures c
    JOIN developers d ON c.developpeur_id = d.id
    JOIN projects p ON c.project_id = p.id
    WHERE p.entrepreneur_id = ?
    ORDER BY c.date_postulation DESC
");
mysqli_stmt_bind_param($stmt, "i", $entrepreneur_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$candidatures = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['developpeurEvalue'] = (bool)$row['developpeurEvalue'];
    $candidatures[] = $row;
}
echo json_encode($candidatures);
mysqli_stmt_close($stmt);
mysqli_close($conn);
