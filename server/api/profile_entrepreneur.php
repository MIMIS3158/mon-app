<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();


$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
function uploadFile($fieldName, $allowedExt, $uploadDir)
{
    if (empty($_FILES[$fieldName]['name'])) return "";
    $ext = strtolower(pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt)) return "";
    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $uploadDir . $filename)) {
        return 'uploads/' . $filename;
    }
    return "";
}
function nullIfEmpty($value)
{
    return ($value === '' || $value === null) ? null : $value;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_POST['action'] ?? '';
if ($method === 'POST' && $action === 'add') {
    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }
    $check = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($check, "i", $userId);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);
    if (mysqli_stmt_num_rows($check) > 0) {
        echo json_encode(["error" => "Profil déjà existant"]);
        exit;
    }
    mysqli_stmt_close($check);
    $profileImage = uploadFile('profileImage', ['jpg', 'jpeg', 'png', 'gif', 'webp'], $uploadDir);
    $nom    = nullIfEmpty($_POST['Nom'] ?? '');
    $prenom = nullIfEmpty($_POST['Prenom'] ?? '');
    $email  = nullIfEmpty($_POST['Email'] ?? '');
    $uStmt = mysqli_prepare($conn, "SELECT Nom, Prenom, Email FROM users WHERE id = ?");
    mysqli_stmt_bind_param($uStmt, "i", $userId);
    mysqli_stmt_execute($uStmt);
    $uResult = mysqli_stmt_get_result($uStmt);
    $uData = mysqli_fetch_assoc($uResult);
    mysqli_stmt_close($uStmt);
    if ($uData) {
        if (!$nom)    $nom    = $uData['Nom'];
        if (!$prenom) $prenom = $uData['Prenom'];
        if (!$email)  $email  = $uData['Email'];
    }
    $telephone      = nullIfEmpty($_POST['Telephone'] ?? '');
    $secteur        = nullIfEmpty($_POST['Secteur'] ?? '');
    $entreprise     = nullIfEmpty($_POST['Entreprise'] ?? '');
    $description    = nullIfEmpty($_POST['Description'] ?? '');
    $dateNaissance  = nullIfEmpty($_POST['DateNaissance'] ?? '');
    $pays           = nullIfEmpty($_POST['Pays'] ?? '');
    $ville          = nullIfEmpty($_POST['Ville'] ?? '');
    $siteWeb        = nullIfEmpty($_POST['SiteWeb'] ?? '');
    $linkedin       = nullIfEmpty($_POST['Linkedin'] ?? '');
    $tailleEntreprise = nullIfEmpty($_POST['TailleEntreprise'] ?? '');
    $anneeCreation  = nullIfEmpty($_POST['AnneeCreation'] ?? '');
    $budgetMoyen    = nullIfEmpty($_POST['BudgetMoyen'] ?? '');
    $profileImageVal = $profileImage ?: null;
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO entrepreneurs
            (user_id, Nom, Prenom, Email, Telephone, Secteur, Entreprise,
             Description, DateNaissance, Pays, Ville, SiteWeb, Linkedin,
             TailleEntreprise, AnneeCreation, BudgetMoyen, profileImage)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "issssssssssssssss",
        $userId,
        $nom,
        $prenom,
        $email,
        $telephone,
        $secteur,
        $entreprise,
        $description,
        $dateNaissance,
        $pays,
        $ville,
        $siteWeb,
        $linkedin,
        $tailleEntreprise,
        $anneeCreation,
        $budgetMoyen,
        $profileImageVal
    );
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id" => mysqli_insert_id($conn)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
} elseif ($method === 'POST' && $action === 'update') {
    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id manquant"]);
        exit;
    }
    $profileImage = uploadFile('profileImage', ['jpg', 'jpeg', 'png', 'gif', 'webp'], $uploadDir);
    $fields = [
        'Nom',
        'Prenom',
        'Email',
        'Telephone',
        'Secteur',
        'Entreprise',
        'Description',
        'DateNaissance',
        'Pays',
        'Ville',
        'SiteWeb',
        'Linkedin',
        'TailleEntreprise',
        'AnneeCreation',
        'BudgetMoyen'
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
    if (empty($setParts)) {
        echo json_encode(["error" => "Aucune donnée à mettre à jour"]);
        exit;
    }
    $values[] = $userId;
    $types   .= 'i';
    $sql  = "UPDATE entrepreneurs SET " . implode(', ', $setParts) . " WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, $types, ...$values);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "rows" => mysqli_stmt_affected_rows($stmt)]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
    }
    if ($profileImage !== "") {
        $uPhoto = mysqli_prepare($conn, "UPDATE users SET photo = ? WHERE id = ?");
        mysqli_stmt_bind_param($uPhoto, "si", $profileImage, $userId);
        mysqli_stmt_execute($uPhoto);
        mysqli_stmt_close($uPhoto);
    }
    mysqli_stmt_close($stmt);
} elseif ($method === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId'];
    $stmt = mysqli_prepare(
        $conn,
        "SELECT e.*, u.Nom, u.Prenom, u.Email 
         FROM entrepreneurs e
         JOIN users u ON e.user_id = u.id
         WHERE e.user_id = ? LIMIT 1"
    );
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data   = mysqli_fetch_assoc($result);
    if ($data) {
        if (!empty($data['profileImage'])) {
            $data['profileImage'] = 'http://localhost:8000/api/' . $data['profileImage'];
        }
        if (empty($data['Nom']))    $data['Nom']    = $data['Nom'];
        if (empty($data['Prenom'])) $data['Prenom'] = $data['Prenom'];
        if (empty($data['Email']))  $data['Email']  = $data['Email'];
        echo json_encode($data);
    } else {
        $uStmt = mysqli_prepare($conn, "SELECT Nom, Prenom, Email FROM users WHERE id = ?");
        mysqli_stmt_bind_param($uStmt, "i", $userId);
        mysqli_stmt_execute($uStmt);
        $uResult = mysqli_stmt_get_result($uStmt);
        $uData = mysqli_fetch_assoc($uResult);
        mysqli_stmt_close($uStmt);
        echo json_encode($uData ? [
            "Nom"    => $uData['Nom'],
            "Prenom" => $uData['Prenom'],
            "Email"  => $uData['Email']
        ] : []);
    }
    mysqli_stmt_close($stmt);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Requête non reconnue"]);
}
mysqli_close($conn);