<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id = $_GET['userId'] ?? null;
$role    = $_GET['role'] ?? null;

if (!$user_id) {
    echo json_encode(['messages' => 0, 'notifications' => 0, 'en_cours' => 0, 'termines' => 0, 'evaluations' => 0]);
    exit;
}

$messages_non_lus = 0;
$notif = 0;
$en_cours = 0;
$termines = 0;
$evaluations = 0;
$msgStmt = mysqli_prepare($conn, "SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND lu = 0");

mysqli_stmt_bind_param($msgStmt, "i", $user_id);
mysqli_stmt_execute($msgStmt);
mysqli_stmt_bind_result($msgStmt, $messages_non_lus);
mysqli_stmt_fetch($msgStmt);
mysqli_stmt_close($msgStmt);

if ($role === 'entrepreneur') {
    $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($eStmt, "i", $user_id);
    mysqli_stmt_execute($eStmt);
    mysqli_stmt_bind_result($eStmt, $entrepreneur_id);
    mysqli_stmt_fetch($eStmt);
    mysqli_stmt_close($eStmt);

    if ($entrepreneur_id) {
        $nStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM candidatures c
            JOIN projects p ON c.project_id = p.id
            WHERE p.entrepreneur_id = ? AND c.statut = 'En attente'
        ");
        mysqli_stmt_bind_param($nStmt, "i", $entrepreneur_id);
        mysqli_stmt_execute($nStmt);
        mysqli_stmt_bind_result($nStmt, $notif);
        mysqli_stmt_fetch($nStmt);
        mysqli_stmt_close($nStmt);

        $enCoursStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM projects 
            WHERE entrepreneur_id = ? AND Statut = 'en cours'
        ");
        mysqli_stmt_bind_param($enCoursStmt, "i", $entrepreneur_id);
        mysqli_stmt_execute($enCoursStmt);
        mysqli_stmt_bind_result($enCoursStmt, $en_cours);
        mysqli_stmt_fetch($enCoursStmt);
        mysqli_stmt_close($enCoursStmt);

        $terminesStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM candidatures c
            JOIN projects p ON c.project_id = p.id
            WHERE p.entrepreneur_id = ? 
            AND c.statut = 'Terminée'
            AND c.developpeur_evalue = 0
        ");
        mysqli_stmt_bind_param($terminesStmt, "i", $entrepreneur_id);
        mysqli_stmt_execute($terminesStmt);
        mysqli_stmt_bind_result($terminesStmt, $termines);
        mysqli_stmt_fetch($terminesStmt);
        mysqli_stmt_close($terminesStmt);

        $evalStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM evaluations 
            WHERE id_evalue = ? 
            AND date_evaluation >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ");
        mysqli_stmt_bind_param($evalStmt, "i", $entrepreneur_id);
        mysqli_stmt_execute($evalStmt);
        mysqli_stmt_bind_result($evalStmt, $evaluations);
        mysqli_stmt_fetch($evalStmt);
        mysqli_stmt_close($evalStmt);
    }
} elseif ($role === 'developer') {
    $dStmt = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $user_id);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $developer_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);

    if ($developer_id) {
        $nStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM candidatures 
            WHERE developpeur_id = ? AND statut = 'Acceptée'
        ");
        mysqli_stmt_bind_param($nStmt, "i", $developer_id);
        mysqli_stmt_execute($nStmt);
        mysqli_stmt_bind_result($nStmt, $notif);
        mysqli_stmt_fetch($nStmt);
        mysqli_stmt_close($nStmt);

        $evalStmt = mysqli_prepare($conn, "
            SELECT COUNT(*) FROM evaluations 
            WHERE id_evalue = ? 
            AND date_evaluation >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ");
        mysqli_stmt_bind_param($evalStmt, "i", $user_id);
        mysqli_stmt_execute($evalStmt);
        mysqli_stmt_bind_result($evalStmt, $evaluations);
        mysqli_stmt_fetch($evalStmt);
        mysqli_stmt_close($evalStmt);
    }
}

echo json_encode([
    'messages'      => (int)$messages_non_lus,
    'notifications' => (int)$notif,
    'en_cours'      => (int)$en_cours,
    'termines'      => (int)$termines,
    'evaluations'   => (int)$evaluations
]);

mysqli_close($conn);
