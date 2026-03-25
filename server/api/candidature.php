<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();


$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $user_id = $_GET['id_developpeur'] ?? null;
    $dStmt = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $user_id);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $developpeur_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);
    if (!$developpeur_id) {
        echo json_encode([]);
        exit;
    }
    $stmt = mysqli_prepare($conn, "
        SELECT 
            c.id as id_postulation,
            c.message as messagePostulation,
            c.statut,
            c.budget_propose as Budget,
            c.duree_estimee as Duree,
            c.date_postulation,
            c.project_id,
            c.developpeur_id as id_developpeur,
            c.entrepreneur_evalue as entrepreneurEvalue,
            p.Nomduprojet,
            p.Publierparentreprise,
            e.user_id as id_entrepreneur
        FROM candidatures c
        JOIN projects p ON c.project_id = p.id
        JOIN entrepreneurs e ON p.entrepreneur_id = e.id
        WHERE c.developpeur_id = ?
        ORDER BY c.date_postulation DESC
    ");
    mysqli_stmt_bind_param($stmt, "i", $developpeur_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $postulations = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row['entrepreneurEvalue'] = (bool)$row['entrepreneurEvalue'];
        $postulations[] = $row;
    }
    echo json_encode($postulations);
    mysqli_stmt_close($stmt);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $message    = $data['message'] ?? null;
    $project_id = $data['project_id'] ?? null;
    $user_id    = $data['id_developpeur'] ?? null;
    $dStmt = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $user_id);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $developpeur_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);
    if (!$message) {
        http_response_code(400);
        echo json_encode(['error' => 'Message obligatoire']);
        exit;
    }
    if (!$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'project_id manquant']);
        exit;
    }
    if (!$developpeur_id) {
        http_response_code(400);
        echo json_encode(['error' => 'id_developpeur manquant']);
        exit;
    }
    $check = mysqli_prepare($conn, "SELECT id FROM candidatures WHERE developpeur_id = ? AND project_id = ?");
    mysqli_stmt_bind_param($check, "ii", $developpeur_id, $project_id);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);
    if (mysqli_stmt_num_rows($check) > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Vous avez déjà postulé à ce projet']);
        exit;
    }
    mysqli_stmt_close($check);
    $budget        = $data['budget_propose'] ?? null;
    $duree_estimee = $data['duree_estimee'] ?? null;
    $stmt = mysqli_prepare($conn, "
        INSERT INTO candidatures 
            (project_id, developpeur_id, message, budget_propose, duree_estimee, statut, date_postulation)
        VALUES (?, ?, ?, ?, ?, 'En attente', NOW())
    ");
    mysqli_stmt_bind_param($stmt, "iisss", $project_id, $developpeur_id, $message, $budget, $duree_estimee);
    if (mysqli_stmt_execute($stmt)) {
        http_response_code(201);
        echo json_encode(['success' => 'Candidature envoyée avec succès']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
} elseif ($method === 'PUT') {
    $id     = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? null;
    if (!$id || !$action) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres manquants']);
        exit;
    }
    if ($action === 'accepter') {
        $statut = 'Acceptée';
        $projectStmt = mysqli_prepare($conn, "
            UPDATE projects 
            SET Statut = 'en cours' 
            WHERE id = (SELECT project_id FROM candidatures WHERE id = ?)
        ");
        mysqli_stmt_bind_param($projectStmt, "i", $id);
        mysqli_stmt_execute($projectStmt);
        mysqli_stmt_close($projectStmt);
    } elseif ($action === 'refuser') {
        $statut = 'Refusée';
    } elseif ($action === 'terminer') {
        $statut = 'Terminée';
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Action invalide']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "UPDATE candidatures SET statut = ? WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "si", $statut, $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => 'Statut mis à jour']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id manquant']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "DELETE FROM candidatures WHERE id = ? AND statut = 'En attente'");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => 'Candidature annulée']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Impossible d\'annuler cette candidature']);
    }
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);
