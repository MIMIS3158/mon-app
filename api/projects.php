<?php
/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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
// GET → charger projets
// =====================
if ($method === 'GET') {
    $projectId = $_GET['projectId'] ?? null;
    $userId = $_GET['userId'] ?? null;

    if ($projectId) {
        $stmt = mysqli_prepare($conn, "SELECT * FROM projects WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $projectId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $data = mysqli_fetch_assoc($result);
        echo json_encode($data ?: []);
        mysqli_close($conn);
        exit;
    }
    

    if ($userId) {
        $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
        mysqli_stmt_bind_param($eStmt, "i", $userId);
        mysqli_stmt_execute($eStmt);
        mysqli_stmt_bind_result($eStmt, $entrepreneurId);
        mysqli_stmt_fetch($eStmt);
        mysqli_stmt_close($eStmt);

        if (!$entrepreneurId) {
            echo json_encode([]);
            exit;
        }

        $stmt = mysqli_prepare($conn,
            "SELECT p.*, c.nom_categorie 
             FROM projects p
             LEFT JOIN categories c ON p.id_categorie = c.id_categorie
             WHERE p.entrepreneur_id = ?
             ORDER BY p.DatePublication DESC"
        );
        mysqli_stmt_bind_param($stmt, "i", $entrepreneurId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

    } else {
        $result = mysqli_query($conn,
            "SELECT p.*, c.nom_categorie,
                    e.Nom, e.Prenom,
                    e.Secteur, e.TailleEntreprise,
                    e.AnneeCreation, e.Ville, e.Pays,
                    e.SiteWeb, e.Linkedin,
                    e.BudgetMoyen, e.profileImage as photo
             FROM projects p
             LEFT JOIN categories c ON p.id_categorie = c.id_categorie
             LEFT JOIN entrepreneurs e ON p.entrepreneur_id = e.id
             ORDER BY p.DatePublication DESC"
        );
    }

        $projects = [];
while ($row = mysqli_fetch_assoc($result)) {
    if (!$userId) {
        // ⭐ Corriger le chemin photo ICI
        if (!empty($row['photo'])) {
            $row['photo'] = 'http://localhost/myApp/api/' . $row['photo'];
        }
        $row['entrepreneur'] = [
            'id'               => $row['entrepreneur_id'],
            'Nom'              => $row['Nom'] ?? null,
            'Prenom'           => $row['Prenom'] ?? null,
            'Entreprise'       => $row['Publierparentreprise'],
            'photo'            => $row['photo'] ?? null,
            'Secteur'          => $row['Secteur'] ?? null,
            'TailleEntreprise' => $row['TailleEntreprise'] ?? null,
            'AnneeCreation'    => $row['AnneeCreation'] ?? null,
            'Ville'            => $row['Ville'] ?? null,
            'Pays'             => $row['Pays'] ?? null,
            'SiteWeb'          => $row['SiteWeb'] ?? null,
            'Linkedin'         => $row['Linkedin'] ?? null,
            'BudgetMoyen'      => $row['BudgetMoyen'] ?? null
        ];
        unset($row['Nom'], $row['Prenom'], $row['photo'],
              $row['Secteur'], $row['TailleEntreprise'],
              $row['AnneeCreation'], $row['Ville'], $row['Pays'],
              $row['SiteWeb'], $row['Linkedin'], $row['BudgetMoyen']);
    }
    $projects[] = $row;
}
    echo json_encode($projects);
}


// =====================
// POST → ajouter projet
// =====================
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id_entrepreneur  = $data['id_entrepreneur'] ?? null;
    $titre            = $data['Nomduprojet'] ?? null;
    $description      = $data['Descriptionduprojet'] ?? null;
    $budget           = $data['Budget'] ?? null;
    $duree            = $data['Duree'] ?? null;
    $statut           = $data['Statut'] ?? 'en attente';
    $id_categorie     = $data['id_categorie'] ?? null;

    if (!$titre || !$budget || !$id_categorie || !$id_entrepreneur) {
        http_response_code(400);
        echo json_encode(["error" => "Champs obligatoires manquants"]);
        exit;
    }

    $stmt = mysqli_prepare($conn, "
        INSERT INTO projet 
            (id_entrepreneur, titre, description, budget, duree, statut, id_categorie, date_creation)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    mysqli_stmt_bind_param($stmt, "issdiis",
        $id_entrepreneur,
        $titre,
        $description,
        $budget,
        $duree,
        $statut,
        $id_categorie
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

// =====================
// PUT → mettre à jour statut
// =====================

elseif ($method === 'PUT') {
    $id     = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? null;

    if (!$id || !$action) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètres manquants"]);
        exit;
    }

    if ($action === 'valider') {
        $statut = 'Terminé';
    } elseif ($action === 'encours') {
        $statut = 'En cours';
    } elseif ($action === 'annuler') {
        $statut = 'En attente';
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Action invalide"]);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE projet SET statut = ? WHERE id_projet = ?");
    mysqli_stmt_bind_param($stmt, "si", $statut, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "statut" => $statut]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}


// =====================
// DELETE → supprimer projet
// =====================
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit;
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM projet WHERE id_projet = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

else {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
}

mysqli_close($conn);
*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

if ($method === 'GET') {
    $projectId = $_GET['projectId'] ?? null;
    $userId = $_GET['userId'] ?? null;

    if ($projectId) {
        $stmt = mysqli_prepare($conn, "SELECT * FROM projects WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $projectId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $data = mysqli_fetch_assoc($result);
        echo json_encode($data ?: []);
        mysqli_close($conn);
        exit;
    }

    if ($userId) {
        $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
        mysqli_stmt_bind_param($eStmt, "i", $userId);
        mysqli_stmt_execute($eStmt);
        mysqli_stmt_bind_result($eStmt, $entrepreneurId);
        mysqli_stmt_fetch($eStmt);
        mysqli_stmt_close($eStmt);

        if (!$entrepreneurId) {
            echo json_encode([]);
            exit;
        }

        $stmt = mysqli_prepare($conn,
            "SELECT p.*, c.nom_categorie 
             FROM projects p
             LEFT JOIN categories c ON p.id_categorie = c.id_categorie
             WHERE p.entrepreneur_id = ?
             ORDER BY p.DatePublication DESC"
        );
        mysqli_stmt_bind_param($stmt, "i", $entrepreneurId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

    } else {
        $result = mysqli_query($conn,
            "SELECT p.*, c.nom_categorie,
                    e.Nom, e.Prenom,
                    e.Secteur, e.TailleEntreprise,
                    e.AnneeCreation, e.Ville, e.Pays,
                    e.SiteWeb, e.Linkedin,
                    e.BudgetMoyen, e.profileImage as photo
             FROM projects p
             LEFT JOIN categories c ON p.id_categorie = c.id_categorie
             LEFT JOIN entrepreneurs e ON p.entrepreneur_id = e.id
             ORDER BY p.DatePublication DESC"
        );
    }

    $projects = [];
    while ($row = mysqli_fetch_assoc($result)) {
        if (!$userId) {
          /*  if (!empty($row['photo'])) {
                $row['photo'] = 'http://localhost/myApp/api/' . $row['photo'];
            }*/if (!empty($row['photo'])) {
    $row['photo'] = 'http://localhost/myApp/api/' . $row['photo'];
} else {
    $row['photo'] = 'http://localhost/myApp/www/assets/téléchargement (10).jpeg';
}
            $row['entrepreneur'] = [
                'id'               => $row['entrepreneur_id'],
                'Nom'              => $row['Nom'] ?? null,
                'Prenom'           => $row['Prenom'] ?? null,
                'Entreprise'       => $row['Publierparentreprise'],
                'photo'            => $row['photo'] ?? null,
                'Secteur'          => $row['Secteur'] ?? null,
                'TailleEntreprise' => $row['TailleEntreprise'] ?? null,
                'AnneeCreation'    => $row['AnneeCreation'] ?? null,
                'Ville'            => $row['Ville'] ?? null,
                'Pays'             => $row['Pays'] ?? null,
                'SiteWeb'          => $row['SiteWeb'] ?? null,
                'Linkedin'         => $row['Linkedin'] ?? null,
                'BudgetMoyen'      => $row['BudgetMoyen'] ?? null
            ];
            unset($row['Nom'], $row['Prenom'], $row['photo'],
                  $row['Secteur'], $row['TailleEntreprise'],
                  $row['AnneeCreation'], $row['Ville'], $row['Pays'],
                  $row['SiteWeb'], $row['Linkedin'], $row['BudgetMoyen']);
        }
        $projects[] = $row;
    }
    echo json_encode($projects);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id      = $data['user_id'] ?? null;
    $titre        = $data['Nomduprojet'] ?? null;
    $description  = $data['Descriptionduprojet'] ?? null;
    $budget       = $data['Budget'] ?? null;
    $duree        = $data['Duree'] ?? null;
    $statut       = $data['Statut'] ?? 'en attente';
    $id_categorie = $data['id_categorie'] ?? null;
    $competences  = $data['Competences'] ?? null;
    $publier      = $data['Publierparentreprise'] ?? null;

    $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($eStmt, "i", $user_id);
    mysqli_stmt_execute($eStmt);
    mysqli_stmt_bind_result($eStmt, $entrepreneurId);
    mysqli_stmt_fetch($eStmt);
    mysqli_stmt_close($eStmt);

    if (!$titre || !$budget || !$id_categorie || !$entrepreneurId) {
        http_response_code(400);
        echo json_encode(["error" => "Champs obligatoires manquants"]);
        exit;
    }

    $stmt = mysqli_prepare($conn, "
        INSERT INTO projects 
            (entrepreneur_id, Nomduprojet, Descriptionduprojet, Budget, Duree, Statut, id_categorie, Competences, Publierparentreprise, DatePublication)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    mysqli_stmt_bind_param($stmt, "isssssisss",
        $entrepreneurId,
        $titre,
        $description,
        $budget,
        $duree,
        $statut,
        $id_categorie,
        $competences,
        $publier
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'PUT') {
    $id     = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit;
    }

    if ($action === 'valider') {
        $statut = 'terminé';
        $stmt = mysqli_prepare($conn, "UPDATE projects SET Statut = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "si", $statut, $id);
        mysqli_stmt_execute($stmt);
        echo json_encode(["success" => true]);
        mysqli_stmt_close($stmt);

    } elseif ($action === 'refaire') {
        $statut = 'en cours';
        $stmt = mysqli_prepare($conn, "UPDATE projects SET Statut = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "si", $statut, $id);
        mysqli_stmt_execute($stmt);
        echo json_encode(["success" => true]);
        mysqli_stmt_close($stmt);

    } else {
        $data        = json_decode(file_get_contents("php://input"), true);
        $nom         = $data['Nomduprojet'] ?? '';
        $publier     = $data['Publierparentreprise'] ?? '';
        $budget      = $data['Budget'] ?? '';
        $duree       = $data['Duree'] ?? '';
        $competences = $data['Competences'] ?? '';
        $statut      = $data['Statut'] ?? '';
        $categorie   = (int)($data['id_categorie'] ?? 0);
        $description = $data['Descriptionduprojet'] ?? '';
        $projectId   = (int)$id;

        $stmt = mysqli_prepare($conn, "
            UPDATE projects SET 
                Nomduprojet = ?,
                Publierparentreprise = ?,
                Budget = ?,
                Duree = ?,
                Competences = ?,
                Statut = ?,
                id_categorie = ?,
                Descriptionduprojet = ?
            WHERE id = ?
        ");
        mysqli_stmt_bind_param($stmt, "ssssssisi",
            $nom,
            $publier,
            $budget,
            $duree,
            $competences,
            $statut,
            $categorie,
            $description,
            $projectId
        );
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($conn)]);
        }
        mysqli_stmt_close($stmt);
    }

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit;
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM candidatures WHERE project_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $stmt = mysqli_prepare($conn, "DELETE FROM favorites WHERE project_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $stmt = mysqli_prepare($conn, "DELETE FROM projects WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} else {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
}

mysqli_close($conn);
?>