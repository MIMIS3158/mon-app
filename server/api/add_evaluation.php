<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data = json_decode(file_get_contents('php://input'), true);
$id_projet       = $data['id_projet'] ?? null;
$id_evalue       = $data['id_evalue'] ?? null;
$type_evaluateur = $data['type_evaluateur'] ?? null;
$note            = $data['note'] ?? null;
$commentaire     = $data['commentaire'] ?? null;
$avis_type       = $data['avis_type'] ?? 'positif';
$user_id         = $data['user_id'] ?? null;
if (!$id_projet || !$id_evalue || !$type_evaluateur || !$note || !$commentaire) {
    http_response_code(400);
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}
$id_evalue_original = $id_evalue;
if ($type_evaluateur === 'entrepreneur') {
    $dStmt = mysqli_prepare($conn, "SELECT user_id FROM developers WHERE id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $id_evalue);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $dev_user_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);
    if ($dev_user_id) $id_evalue = $dev_user_id;
}
$stmt = mysqli_prepare($conn, "
    INSERT INTO evaluations 
        (id_projet, id_evalue, type_evaluateur, note, commentaire, avis_type, date_evaluation, id_evaluateur)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
");
mysqli_stmt_bind_param(
    $stmt,
    "iisissi",
    $id_projet,
    $id_evalue,
    $type_evaluateur,
    $note,
    $commentaire,
    $avis_type,
    $user_id
);
if (mysqli_stmt_execute($stmt)) {
    if ($type_evaluateur === 'developpeur' && $user_id) {
        $upd = mysqli_prepare($conn, "
            UPDATE candidatures 
            SET entrepreneur_evalue = 1 
            WHERE project_id = ? AND developpeur_id = (
                SELECT id FROM developers WHERE user_id = ?
            )
        ");
        mysqli_stmt_bind_param($upd, "ii", $id_projet, $user_id);
        mysqli_stmt_execute($upd);
        mysqli_stmt_close($upd);
    }
    if ($type_evaluateur === 'entrepreneur' && $user_id) {
        $upd = mysqli_prepare($conn, "
            UPDATE candidatures 
            SET developpeur_evalue = 1 
            WHERE project_id = ? AND developpeur_id = ?
        ");
        mysqli_stmt_bind_param($upd, "ii", $id_projet, $id_evalue_original);
        mysqli_stmt_execute($upd);
        mysqli_stmt_close($upd);
    }
    http_response_code(201);
    echo json_encode(['success' => 'Évaluation publiée avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['error' => mysqli_error($conn)]);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
