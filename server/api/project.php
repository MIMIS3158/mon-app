<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = isset($data['user_id']) ? intval($data['user_id']) : 0;
    if ($userId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => ["user_id manquant ou invalide"]]);
        exit;
    }
    $stmtE = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($stmtE, "i", $userId);
    mysqli_stmt_execute($stmtE);
    mysqli_stmt_bind_result($stmtE, $entrepreneurId);
    mysqli_stmt_fetch($stmtE);
    mysqli_stmt_close($stmtE);
    if (!$entrepreneurId) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => ["Entrepreneur non trouvé pour cet user_id"]]);
        exit;
    }
    $nomduprojet = trim($data['Nomduprojet'] ?? '');
    $publierparentreprise = trim($data['Publierparentreprise'] ?? '') ?: null;
    $budget = trim($data['Budget'] ?? '');
    $duree = trim($data['Duree'] ?? '');
    $competences = trim($data['Competences'] ?? '') ?: null;
    $statut = trim($data['Statut'] ?? 'en attente');
    $id_categorie = isset($data['id_categorie']) ? intval($data['id_categorie']) : 0;
    $description = trim($data['description'] ?? '') ?: null;
    $errors = [];
    if (empty($nomduprojet)) $errors[] = "Le nom du projet est requis.";
    if (empty($budget)) $errors[] = "Le budget est requis.";
    if ($id_categorie <= 0) $errors[] = "Veuillez sélectionner une catégorie valide.";
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => $errors]);
        exit;
    }
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO projects 
        (entrepreneur_id, Nomduprojet, Publierparentreprise, Budget, Duree, Competences, Statut, id_categorie, Descriptionduprojet, DatePublication)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "issssssss",
        $entrepreneurId,
        $nomduprojet,
        $publierparentreprise,
        $budget,
        $duree,
        $competences,
        $statut,
        $id_categorie,
        $description
    );
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        echo json_encode(["success" => false, "errors" => [mysqli_stmt_error($stmt)]]);
        exit;
    }
    echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    mysqli_stmt_close($stmt);
} elseif ($method === 'PUT') {
    parse_str($_SERVER['QUERY_STRING'], $query);
    $projectId = isset($query['id']) ? intval($query['id']) : 0;
    if ($projectId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => ["ID projet invalide"]]);
        exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $nomduprojet = trim($data['Nomduprojet'] ?? '');
    $publierparentreprise = trim($data['Publierparentreprise'] ?? null);
    $budget = trim($data['Budget'] ?? '');
    $duree = trim($data['Duree'] ?? '');
    $competences = trim($data['Competences'] ?? null);
    $statut = trim($data['Statut'] ?? 'en attente');
    $id_categorie = isset($data['id_categorie']) ? intval($data['id_categorie']) : 0;
    $description = trim($data['description'] ?? null);
    $errors = [];
    if (empty($nomduprojet)) $errors[] = "Le nom du projet est requis.";
    if (empty($budget)) $errors[] = "Le budget est requis.";
    if ($id_categorie <= 0) $errors[] = "Veuillez sélectionner une catégorie valide.";
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => $errors]);
        exit;
    }
    $stmt = mysqli_prepare(
        $conn,
        "UPDATE projects SET Nomduprojet=?, Publierparentreprise=?, Budget=?, Duree=?, Competences=?, Statut=?, id_categorie=?, Descriptionduprojet=? WHERE id=?"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "ssssssssi",
        $nomduprojet,
        $publierparentreprise,
        $budget,
        $duree,
        $competences,
        $statut,
        $id_categorie,
        $description,
        $projectId
    );
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        echo json_encode(["success" => false, "errors" => [mysqli_stmt_error($stmt)]]);
        exit;
    }
    echo json_encode(["success" => true, "message" => "Projet modifié avec succès"]);
    mysqli_stmt_close($stmt);
} elseif ($method === 'GET') {
    $result = mysqli_query(
        $conn,
        "SELECT p.*, c.nom_categorie 
         FROM projects p
         LEFT JOIN categories c ON p.id_categorie = c.id_categorie
         ORDER BY p.DatePublication DESC"
    );
    $projects = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $projects[] = $row;
    }
    echo json_encode($projects);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "errors" => ["Méthode non autorisée"]]);
}
mysqli_close($conn);
