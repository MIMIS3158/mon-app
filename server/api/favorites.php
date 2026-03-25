<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
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
            p.id,
            p.Nomduprojet,
            p.Descriptionduprojet,
            p.Budget,
            p.Duree,
            p.Competences,
            p.Statut,
            p.Publierparentreprise,
            p.DatePublication
        FROM favorites f
        JOIN projects p ON f.project_id = p.id
        WHERE f.developpeur_id = ?
        ORDER BY p.DatePublication DESC
    ");
    mysqli_stmt_bind_param($stmt, "i", $developpeur_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $favorites = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $favorites[] = $row;
    }
    echo json_encode($favorites);
    mysqli_stmt_close($stmt);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id    = $data['id_developpeur'] ?? null;
    $project_id = $data['project_id'] ?? null;
    $dStmt = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $user_id);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $developpeur_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);
    if (!$developpeur_id || !$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "INSERT IGNORE INTO favorites (developpeur_id, project_id) VALUES (?, ?)");
    mysqli_stmt_bind_param($stmt, "ii", $developpeur_id, $project_id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => 'Favori ajouté']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur ajout favori']);
    }
    mysqli_stmt_close($stmt);
} elseif ($method === 'DELETE') {
    $user_id    = $_GET['id_developpeur'] ?? null;
    $project_id = $_GET['id'] ?? null;
    $dStmt = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($dStmt, "i", $user_id);
    mysqli_stmt_execute($dStmt);
    mysqli_stmt_bind_result($dStmt, $developpeur_id);
    mysqli_stmt_fetch($dStmt);
    mysqli_stmt_close($dStmt);
    if (!$developpeur_id || !$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "DELETE FROM favorites WHERE developpeur_id = ? AND project_id = ?");
    mysqli_stmt_bind_param($stmt, "ii", $developpeur_id, $project_id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => 'Favori supprimé']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur suppression favori']);
    }
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);
