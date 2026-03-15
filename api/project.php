<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $userId = $data['user_id'] ?? null;

    // Récupérer l'id entrepreneur depuis la table entrepreneurs
    $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($eStmt, "i", $userId);
    mysqli_stmt_execute($eStmt);
    mysqli_stmt_bind_result($eStmt, $entrepreneurId);
    mysqli_stmt_fetch($eStmt);
    mysqli_stmt_close($eStmt);

    $nomduprojet          = $data['Nomduprojet'] ?? null;
    $publierparentreprise = $data['Publierparentreprise'] ?? null;
    $budget               = $data['Budget'] ?? null;
    $duree                = $data['Duree'] ?? null;
    $competences          = $data['Competences'] ?? null;
    $statut               = $data['Statut'] ?? 'en attente';
    $id_categorie         = $data['id_categorie'] ?? null;
    $description          = $data['Descriptionduprojet'] ?? null;

    if (!$nomduprojet || !$budget || !$id_categorie) {
        http_response_code(400);
        echo json_encode(["error" => "Champs obligatoires manquants"]);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "INSERT INTO projects 
            (entrepreneur_id, Nomduprojet, Publierparentreprise, Budget, Duree, 
             Competences, Statut, id_categorie, Descriptionduprojet, DatePublication)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
    );

    mysqli_stmt_bind_param($stmt, "issdissis",
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

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'GET') {

    $result = mysqli_query($conn,
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
    echo json_encode(["error" => "Méthode non autorisée"]);
}

mysqli_close($conn);
?>