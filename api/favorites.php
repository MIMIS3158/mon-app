<?php
/*
 * API pour gérer les favoris des développeurs
 * GET → Récupérer les favoris d'un développeur
 * POST → Ajouter un favori
 * DELETE → Supprimer un favori
 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

$method = $_SERVER['REQUEST_METHOD'];

// =====================
// GET — Récupérer les favoris
// =====================
if ($method === 'GET') {
    $id_developpeur = $_GET['id_developpeur'] ?? null;

    if (!$id_developpeur) {
        http_response_code(400);
        echo json_encode(['error' => 'id_developpeur manquant']);
        exit;
    }

    $id_developpeur = mysqli_real_escape_string($conn, $id_developpeur);

    $result = mysqli_query($conn, "
        SELECT id_projet as project_id 
        FROM favorites 
        WHERE id_developpeur = '$id_developpeur'
    ");

    $favorites = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $favorites[] = $row;
    }

    echo json_encode($favorites);
}

// =====================
// POST — Ajouter un favori
// =====================
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_developpeur = $data['id_developpeur'] ?? null;
    $project_id = $data['project_id'] ?? null;

    if (!$id_developpeur || !$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $id_developpeur = mysqli_real_escape_string($conn, $id_developpeur);
    $project_id = mysqli_real_escape_string($conn, $project_id);

    $result = mysqli_query($conn, "
        INSERT IGNORE INTO favorites (id_developpeur, id_projet) 
        VALUES ('$id_developpeur', '$project_id')
    ");

    if ($result) {
        echo json_encode(['success' => 'Favori ajouté']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur ajout favori']);
    }
}

// =====================
// DELETE — Supprimer un favori
// =====================
elseif ($method === 'DELETE') {
    $id_developpeur = $_GET['id_developpeur'] ?? null;
    $project_id = $_GET['id'] ?? null;

    if (!$id_developpeur || !$project_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $id_developpeur = mysqli_real_escape_string($conn, $id_developpeur);
    $project_id = mysqli_real_escape_string($conn, $project_id);

    $result = mysqli_query($conn, "
        DELETE FROM favorites 
        WHERE id_developpeur = '$id_developpeur' 
        AND id_projet = '$project_id'
    ");

    if ($result) {
        echo json_encode(['success' => 'Favori supprimé']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur suppression favori']);
    }
}

mysqli_close($conn);*/
?>
<?php /*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

$method = $_SERVER['REQUEST_METHOD'];

// =====================
// GET — Récupérer les candidatures
// =====================
if ($method === 'GET') {
    $developpeur_id = $_GET['id_developpeur'] ?? null;

    if (!$developpeur_id) {
        http_response_code(400);
        echo json_encode(['error' => 'id_developpeur manquant']);
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
            e.id as id_entrepreneur
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
        $row['entrepreneurEvalue'] = (bool)$row['entrepreneur_evalue'];
        $postulations[] = $row;
    }

    echo json_encode($postulations);
    mysqli_stmt_close($stmt);
}

// =====================
// POST — Ajouter une candidature
// =====================
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $message        = $data['message'] ?? null;
    $project_id     = $data['project_id'] ?? null;
    $developpeur_id = $data['id_developpeur'] ?? null;

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

    // Vérifier si déjà postulé
    $check = mysqli_prepare($conn, "
        SELECT id FROM candidatures 
        WHERE developpeur_id = ? AND project_id = ?
    ");
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

    mysqli_stmt_bind_param($stmt, "iisss",
        $project_id,
        $developpeur_id,
        $message,
        $budget,
        $duree_estimee
    );

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(201);
        echo json_encode(['success' => 'Candidature envoyée avec succès']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

// =====================
// DELETE — Annuler une candidature
// =====================
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id manquant']);
        exit;
    }

    $stmt = mysqli_prepare($conn, "
        DELETE FROM candidatures 
        WHERE id = ? 
        AND statut = 'En attente'
    ");

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

mysqli_close($conn);*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

$method = $_SERVER['REQUEST_METHOD'];

// ⭐ Ajouter après $conn

// GET
/*
if ($method === 'GET') {
    $user_id = $_GET['id_developpeur'] ?? null;
    
    // ⭐ Trouver developpeur_id depuis user_id
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

    $stmt = mysqli_prepare($conn, "SELECT project_id FROM favorites WHERE developpeur_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $developpeur_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $favorites = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $favorites[] = $row;
    }
    echo json_encode($favorites);
    mysqli_stmt_close($stmt);
}
*/
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

    // ⭐ JOIN avec projects pour avoir tous les détails
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
}
// POST
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id    = $data['id_developpeur'] ?? null;
    $project_id = $data['project_id'] ?? null;

    // ⭐ Trouver developpeur_id depuis user_id
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
}

// DELETE
elseif ($method === 'DELETE') {
    $user_id    = $_GET['id_developpeur'] ?? null;
    $project_id = $_GET['id'] ?? null;

    // ⭐ Trouver developpeur_id depuis user_id
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
?>