<?php
/*header("Access-Control-Allow-Origin: *");
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

// Dossier uploads
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Fonction upload sécurisée
function uploadFile($fieldName, $allowedExt, $uploadDir) {
    if (empty($_FILES[$fieldName]['name'])) return "";
    $ext = strtolower(pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt)) return "";
    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $uploadDir . $filename)) {
        return 'uploads/' . $filename;
    }
    return "";
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_POST['action'] ?? '';


   //ADD  →  POST + action=add

if ($method === 'POST' && $action === 'add') {

    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }

    // Vérifier si profil existe déjà
    $check = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($check, "i", $userId);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);
    if (mysqli_stmt_num_rows($check) > 0) {
        echo json_encode(["error" => "Profil déjà existant"]);
        exit;
    }
    mysqli_stmt_close($check);

    $profileImage = uploadFile('profileImage', ['jpg','jpeg','png','gif','webp'], $uploadDir);
    $portfolio    = uploadFile('portfolio', ['pdf'], $uploadDir);

    $stmt = mysqli_prepare($conn,
        "INSERT INTO developers
            (user_id, Nomdev, Prenomdev, Pseudo, Emaildev, Telephone,
             CompetencesTechniques, Experience, Niveau,
             DateNaissance, Pays, Ville, Biographie, Github,
             profileImage, portfolio)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );

    $dn = $_POST['DateNaissance'] ?: null;
    $nv = $_POST['Niveau'] ?: null;

    mysqli_stmt_bind_param($stmt, "isssssssssssssss",
        $userId,
        $_POST['Nomdev'],
        $_POST['Prenomdev'],
        $_POST['Pseudo'],
        $_POST['Emaildev'],
        $_POST['Telephone'],
        $_POST['CompetencesTechniques'],
        $_POST['Experience'],
        $nv,
        $dn,
        $_POST['Pays'],
        $_POST['Ville'],
        $_POST['Biographie'],
        $_POST['Github'],
        $profileImage,
        $portfolio
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}


  // UPDATE  →  POST + action=update

elseif ($method === 'POST' && $action === 'update') {

    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }

    $profileImage = uploadFile('profileImage', ['jpg','jpeg','png','gif','webp'], $uploadDir);
    $portfolio    = uploadFile('portfolio', ['pdf'], $uploadDir);

    $fields = [
        'Nomdev', 'Prenomdev', 'Pseudo', 'Emaildev', 'Telephone',
        'CompetencesTechniques', 'Experience', 'Niveau',
        'DateNaissance', 'Pays', 'Ville', 'Biographie', 'Github'
    ];

    $setParts = [];
    $values   = [];
    $types    = '';

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            $setParts[] = "$field = ?";
            $values[]   = $_POST[$field] ?: null;
            $types     .= 's';
        }
    }

    if ($profileImage !== "") {
        $setParts[] = "profileImage = ?";
        $values[]   = $profileImage;
        $types     .= 's';
    }

    if ($portfolio !== "") {
        $setParts[] = "portfolio = ?";
        $values[]   = $portfolio;
        $types     .= 's';
    }

    if (empty($setParts)) {
        echo json_encode(["error" => "Aucune donnée à mettre à jour"]);
        exit;
    }

    $values[] = $userId;
    $types   .= 'i';

    $sql  = "UPDATE developers SET " . implode(', ', $setParts) . " WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, $types, ...$values);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "rows" => mysqli_stmt_affected_rows($stmt)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

   //GET  →  GET + ?userId=...

elseif ($method === 'GET' && isset($_GET['userId'])) {

    $userId = $_GET['userId'];

    $stmt = mysqli_prepare($conn,
        "SELECT * FROM developers WHERE user_id = ? LIMIT 1"
    );
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data   = mysqli_fetch_assoc($result);

    if ($data) {
        if (!empty($data['profileImage'])) {
            $data['profileImage'] = 'http://localhost/myApp/api/' . $data['profileImage'];
        }
        echo json_encode($data);
    } else {
        echo json_encode([]);
    }
    mysqli_stmt_close($stmt);
}

else {
    http_response_code(405);
    echo json_encode(["error" => "Requête non reconnue"]);
}

mysqli_close($conn);*/


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

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

function uploadFile($fieldName, $allowedExt, $uploadDir) {
    if (empty($_FILES[$fieldName]['name'])) return "";
    $ext = strtolower(pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt)) return "";
    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $uploadDir . $filename)) {
        return 'uploads/' . $filename;
    }
    return "";
}

function nullIfEmpty($value) {
    return ($value === '' || $value === null) ? null : $value;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_POST['action'] ?? '';

/* =========================
   ADD
========================= */
if ($method === 'POST' && $action === 'add') {

    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }

    $check = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    mysqli_stmt_bind_param($check, "i", $userId);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);
    if (mysqli_stmt_num_rows($check) > 0) {
        echo json_encode(["error" => "Profil déjà existant"]);
        exit;
    }
    mysqli_stmt_close($check);

    $profileImage = uploadFile('profileImage', ['jpg','jpeg','png','gif','webp'], $uploadDir);
    $portfolio    = uploadFile('portfolio', ['pdf'], $uploadDir);

    // Récupérer Nom/Prenom/Email depuis users
    $nomdev    = nullIfEmpty($_POST['Nomdev'] ?? '');
    $prenomdev = nullIfEmpty($_POST['Prenomdev'] ?? '');
    $emaildev  = nullIfEmpty($_POST['Emaildev'] ?? '');

    $uStmt = mysqli_prepare($conn, "SELECT Nom, Prenom, Email FROM users WHERE id = ?");
    mysqli_stmt_bind_param($uStmt, "i", $userId);
    mysqli_stmt_execute($uStmt);
    $uResult = mysqli_stmt_get_result($uStmt);
    $uData = mysqli_fetch_assoc($uResult);
    mysqli_stmt_close($uStmt);

    if ($uData) {
        if (!$nomdev)    $nomdev    = $uData['Nom'];
        if (!$prenomdev) $prenomdev = $uData['Prenom'];
        if (!$emaildev)  $emaildev  = $uData['Email'];
    }

    $pseudo      = nullIfEmpty($_POST['Pseudo'] ?? '');
    $telephone   = nullIfEmpty($_POST['Telephone'] ?? '');
    $competences = nullIfEmpty($_POST['CompetencesTechniques'] ?? '');
    $experience  = nullIfEmpty($_POST['Experience'] ?? '');
    $nv          = nullIfEmpty($_POST['Niveau'] ?? '');
    $dn          = nullIfEmpty($_POST['DateNaissance'] ?? '');
    $pays        = nullIfEmpty($_POST['Pays'] ?? '');
    $ville       = nullIfEmpty($_POST['Ville'] ?? '');
    $biographie  = nullIfEmpty($_POST['Biographie'] ?? '');
    $github      = nullIfEmpty($_POST['Github'] ?? '');
    $profileImageVal = $profileImage ?: null;
    $portfolioVal    = $portfolio ?: null;

    $stmt = mysqli_prepare($conn,
        "INSERT INTO developers
            (user_id, Nomdev, Prenomdev, Pseudo, Emaildev, Telephone,
             CompetencesTechniques, Experience, Niveau,
             DateNaissance, Pays, Ville, Biographie, Github,
             profileImage, portfolio)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );

    mysqli_stmt_bind_param($stmt, "isssssssssssssss",
        $userId, $nomdev, $prenomdev, $pseudo, $emaildev, $telephone,
        $competences, $experience, $nv, $dn, $pays, $ville,
        $biographie, $github, $profileImageVal, $portfolioVal
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

/* =========================
   UPDATE
========================= */
elseif ($method === 'POST' && $action === 'update') {

    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }

    $profileImage = uploadFile('profileImage', ['jpg','jpeg','png','gif','webp'], $uploadDir);
    $portfolio    = uploadFile('portfolio', ['pdf'], $uploadDir);

    $fields = [
        'Nomdev', 'Prenomdev', 'Pseudo', 'Emaildev', 'Telephone',
        'CompetencesTechniques', 'Experience', 'Niveau',
        'DateNaissance', 'Pays', 'Ville', 'Biographie', 'Github'
    ];

    $setParts = [];
    $values   = [];
    $types    = '';

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            $setParts[] = "$field = ?";
            $values[]   = nullIfEmpty($_POST[$field]);
            $types     .= 's';
        }
    }

    if ($profileImage !== "") {
        $setParts[] = "profileImage = ?";
        $values[]   = $profileImage;
        $types     .= 's';
    }

    if ($portfolio !== "") {
        $setParts[] = "portfolio = ?";
        $values[]   = $portfolio;
        $types     .= 's';
    }

    if (empty($setParts)) {
        echo json_encode(["error" => "Aucune donnée à mettre à jour"]);
        exit;
    }

    $values[] = $userId;
    $types   .= 'i';

    $sql  = "UPDATE developers SET " . implode(', ', $setParts) . " WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, $types, ...$values);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "rows" => mysqli_stmt_affected_rows($stmt)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }



    if ($profileImage !== "") {
    // Mettre à jour aussi dans users
    $uPhoto = mysqli_prepare($conn, "UPDATE users SET photo = ? WHERE id = ?");
    mysqli_stmt_bind_param($uPhoto, "si", $profileImage, $userId);
    mysqli_stmt_execute($uPhoto);
    mysqli_stmt_close($uPhoto);
}


    mysqli_stmt_close($stmt);
}

/* =========================
   GET
========================= */
elseif ($method === 'GET' && isset($_GET['userId'])) {

    $userId = $_GET['userId'];

    $stmt = mysqli_prepare($conn,
        "SELECT d.*, u.Nom, u.Prenom, u.Email 
         FROM developers d
         JOIN users u ON d.user_id = u.id
         WHERE d.user_id = ? LIMIT 1"
    );
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data   = mysqli_fetch_assoc($result);

    if ($data) {
        if (!empty($data['profileImage'])) {
            $data['profileImage'] = 'http://localhost/myApp/api/' . $data['profileImage'];
        }
        if (empty($data['Nomdev']))    $data['Nomdev']    = $data['Nom'];
        if (empty($data['Prenomdev'])) $data['Prenomdev'] = $data['Prenom'];
        if (empty($data['Emaildev']))  $data['Emaildev']  = $data['Email'];
        echo json_encode($data);
    } else {
        // Pas encore de profil → retourner infos de users
        $uStmt = mysqli_prepare($conn, "SELECT Nom, Prenom, Email FROM users WHERE id = ?");
        mysqli_stmt_bind_param($uStmt, "i", $userId);
        mysqli_stmt_execute($uStmt);
        $uResult = mysqli_stmt_get_result($uStmt);
        $uData = mysqli_fetch_assoc($uResult);
        mysqli_stmt_close($uStmt);
        echo json_encode($uData ? [
            "Nomdev"    => $uData['Nom'],
            "Prenomdev" => $uData['Prenom'],
            "Emaildev"  => $uData['Email']
        ] : []);
    }
    mysqli_stmt_close($stmt);
}

else {
    http_response_code(405);
    echo json_encode(["error" => "Requête non reconnue"]);
}

mysqli_close($conn);

?>