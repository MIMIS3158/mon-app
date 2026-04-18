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
    $titreMission     = trim($data['titreMission'] ?? '');
    $entreprise       = trim($data['entreprise'] ?? '') ?: null;
    $budget           = trim($data['budget'] ?? '');
    $delai            = trim($data['delai'] ?? '');
    $niveauExperience = trim($data['niveauExperience'] ?? '');
    $typeMission      = trim($data['typeMission'] ?? '');
    $id_categorie     = isset($data['id_categorie']) ? intval($data['id_categorie']) : 0;
    $description      = trim($data['description'] ?? '') ?: null;
    $statut           = 'en attente';
    $errors = [];
    if (empty($titreMission))     $errors[] = "Le titre de la mission est requis.";
    if (empty($budget))           $errors[] = "Le budget est requis.";
    if (empty($delai))            $errors[] = "Le délai de livraison est requis.";
    if (empty($niveauExperience)) $errors[] = "Le niveau d'expérience est requis.";
    if (empty($typeMission))      $errors[] = "Le type de mission est requis.";
    if ($id_categorie <= 0)       $errors[] = "Veuillez sélectionner une catégorie valide.";
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => $errors]);
        exit;
    }
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO missions 
        (entrepreneur_id, titreMission, entreprise, budget, delai, niveauExperience, typeMission, id_categorie, description, statut, DatePublication)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "issssssiss",
        $entrepreneurId,
        $titreMission,
        $entreprise,
        $budget,
        $delai,
        $niveauExperience,
        $typeMission,
        $id_categorie,
        $description,
        $statut
    );
    if (!mysqli_stmt_execute($stmt)) {
        error_log(mysqli_stmt_error($stmt));
        http_response_code(500);
        echo json_encode(["success" => false, "errors" => ["Une erreur est survenue lors de la création de la mission"]]);
        exit;
    }
    echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    mysqli_stmt_close($stmt);

} elseif ($method === 'GET') {
    $missionId = isset($_GET['missionId']) ? intval($_GET['missionId']) : 0;
    if ($missionId > 0) {
        $stmt = mysqli_prepare($conn, "SELECT * FROM missions WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $missionId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $data = mysqli_fetch_assoc($result);
        echo json_encode($data ?: []);
        mysqli_close($conn);
        exit;
    }
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;
    /*$sql = "SELECT m.*, c.nom_categorie 
            FROM missions m
            LEFT JOIN categories c ON m.id_categorie = c.id_categorie";*/
           // $sql = "SELECT m.*, c.nom_categorie, e.user_id as user_id 
    $sql = "SELECT 
    m.*, 
    c.nom_categorie,
    e.Nom,
    e.Prenom,
    e.profileImage as photo,
    e.Entreprise,
    e.Ville,
    e.Pays,
    e.user_id as entrepreneur_user_id





        FROM missions m
        LEFT JOIN categories c ON m.id_categorie = c.id_categorie
        LEFT JOIN entrepreneurs e ON m.entrepreneur_id = e.id";
    if ($userId > 0) {
        $stmtE = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
        mysqli_stmt_bind_param($stmtE, "i", $userId);
        mysqli_stmt_execute($stmtE);
        mysqli_stmt_bind_result($stmtE, $entrepreneurId);
        mysqli_stmt_fetch($stmtE);
        mysqli_stmt_close($stmtE);
        if ($entrepreneurId) {
            $sql .= " WHERE m.entrepreneur_id = " . intval($entrepreneurId);
        }
    }
    $sql .= " ORDER BY m.DatePublication DESC";
    $result = mysqli_query($conn, $sql);
    $missions = [];
    /*while ($row = mysqli_fetch_assoc($result)) {
        $missions[] = $row;
    }*/
        while ($row = mysqli_fetch_assoc($result)) {

    $row['entrepreneur'] = [
        'Nom' => $row['Nom'],
        'Prenom' => $row['Prenom'],
        'photo' => $row['photo'] ? getEnvVar("APP_URL") . '/' . $row['photo'] : null,
        
        'Ville' => $row['Ville'],
        'Pays' => $row['Pays'],
        'Entreprise' => $row['Entreprise'],
        'user_id' => $row['entrepreneur_user_id']
    ];

    unset(
        $row['Nom'],
        $row['Prenom'],
        $row['photo'],
        $row['Ville'],
        $row['Pays'],
        $row['Entreprise'],
        $row['entrepreneur_user_id']
    );

    $missions[] = $row;
}


    echo json_encode($missions);
    $missionId = isset($_GET['missionId']) ? intval($_GET['missionId']) : 0;
if ($missionId > 0) {
    $stmt = mysqli_prepare($conn, "SELECT * FROM missions WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $missionId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data = mysqli_fetch_assoc($result);
    echo json_encode($data ?: []);
    mysqli_close($conn);
    exit;
}

} elseif ($method === 'PUT') {
    parse_str($_SERVER['QUERY_STRING'], $query);
    $missionId = isset($query['id']) ? intval($query['id']) : 0;
    if ($missionId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => ["ID mission invalide"]]);
        exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $titreMission     = trim($data['titreMission'] ?? '');
    $entreprise       = trim($data['entreprise'] ?? '') ?: null;
    $budget           = trim($data['budget'] ?? '');
    $delai            = trim($data['delai'] ?? '');
    $niveauExperience = trim($data['niveauExperience'] ?? '');
    $typeMission      = trim($data['typeMission'] ?? '');
    $id_categorie     = isset($data['id_categorie']) ? intval($data['id_categorie']) : 0;
    $description      = trim($data['description'] ?? '') ?: null;
    $errors = [];
    if (empty($titreMission))     $errors[] = "Le titre de la mission est requis.";
    if (empty($budget))           $errors[] = "Le budget est requis.";
    if (empty($delai))            $errors[] = "Le délai de livraison est requis.";
    if ($id_categorie <= 0)       $errors[] = "Veuillez sélectionner une catégorie valide.";
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => $errors]);
        exit;
    }
    $stmt = mysqli_prepare(
        $conn,
        "UPDATE missions SET titreMission=?, entreprise=?, budget=?, delai=?, niveauExperience=?, typeMission=?, id_categorie=?, description=? WHERE id=?"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "ssssssssi",
        $titreMission,
        $entreprise,
        $budget,
        $delai,
        $niveauExperience,
        $typeMission,
        $id_categorie,
        $description,
        $missionId
    );
    if (!mysqli_stmt_execute($stmt)) {
        error_log(mysqli_stmt_error($stmt));
        http_response_code(500);
        echo json_encode(["success" => false, "errors" => ["Une erreur est survenue lors de la mise à jour de la mission"]]);
        exit;
    }
    echo json_encode(["success" => true, "message" => "Mission modifiée avec succès"]);
    mysqli_stmt_close($stmt);

} elseif ($method === 'DELETE') {
    $missionId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($missionId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "errors" => ["ID mission invalide"]]);
        exit;
    }
    $stmt = mysqli_prepare($conn, "DELETE FROM missions WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $missionId);
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        echo json_encode(["success" => false, "errors" => ["Erreur lors de la suppression"]]);
        exit;
    }
    echo json_encode(["success" => true, "message" => "Mission supprimée avec succès"]);
    mysqli_stmt_close($stmt);

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "errors" => ["Méthode non autorisée"]]);
}

mysqli_close($conn);