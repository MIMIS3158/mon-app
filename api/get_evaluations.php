<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
if (!$conn) {
    echo json_encode(["error" => "Erreur connexion"]);
    exit;
}
mysqli_set_charset($conn, "utf8");
$type   = $_GET['type'] ?? null;
$userId = $_GET['userId'] ?? null;
$id_evalue = $_GET['id_evalue'] ?? null;
if (!$id_evalue && $userId) {
    $id_evalue = $userId;
}
if (!$id_evalue) {
    echo json_encode([]);
    exit;
}
$stmt = mysqli_prepare($conn, "
    SELECT 
        e.note,
        e.commentaire,
        e.date_evaluation,
        e.type_evaluateur,
        e.id_evaluateur,
        p.Nomduprojet
    FROM evaluations e
    JOIN projects p ON e.id_projet = p.id
    WHERE e.id_evalue = ?
    ORDER BY e.date_evaluation DESC
");
mysqli_stmt_bind_param($stmt, "i", $id_evalue);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}
echo json_encode($data);
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>