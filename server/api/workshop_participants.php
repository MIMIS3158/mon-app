<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$conn = Database::connect();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $workshop_id = $data['workshop_id'] ?? null;
    $user_id     = $data['user_id'] ?? null;

    if (!$workshop_id || !$user_id) {
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    // Vérifier si déjà inscrit
    $check = mysqli_prepare($conn, 
        "SELECT id FROM workshop_participants WHERE workshop_id = ? AND user_id = ?"
    );
    mysqli_stmt_bind_param($check, "ii", $workshop_id, $user_id);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);

    if (mysqli_stmt_num_rows($check) > 0) {
        echo json_encode(['success' => true, 'message' => 'Déjà inscrit']);
        mysqli_stmt_close($check);
        mysqli_close($conn);
        exit;
    }
    mysqli_stmt_close($check);

    // Insérer
    $stmt = mysqli_prepare($conn,
        "INSERT INTO workshop_participants (workshop_id, user_id) VALUES (?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "ii", $workshop_id, $user_id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>