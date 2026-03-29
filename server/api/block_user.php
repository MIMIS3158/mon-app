<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $blocker_id = $data['blocker_id'] ?? null;
    $blocked_id = $data['blocked_id'] ?? null;

    if (!$blocker_id || !$blocked_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "
        INSERT IGNORE INTO blocked_users (blocker_id, blocked_id) 
        VALUES (?, ?)
    ");
    mysqli_stmt_bind_param($stmt, "ii", $blocker_id, $blocked_id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        error_log(mysqli_error($conn));
        echo json_encode(['error' => 'Erreur lors du blocage']);
    }
    mysqli_stmt_close($stmt);
}
elseif ($method === 'DELETE') {
    $blocker_id = $_GET['blocker_id'] ?? null;
    $blocked_id = $_GET['blocked_id'] ?? null;

    if (!$blocker_id || !$blocked_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $stmt = mysqli_prepare($conn, "
        DELETE FROM blocked_users 
        WHERE blocker_id = ? AND blocked_id = ?
    ");
    mysqli_stmt_bind_param($stmt, "ii", $blocker_id, $blocked_id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        error_log(mysqli_error($conn));
        echo json_encode(['error' => 'Erreur lors du déblocage']);
    }
    mysqli_stmt_close($stmt);
}
elseif ($method === 'GET') {
    $user1 = $_GET['blocker_id'] ?? null;
    $user2 = $_GET['blocked_id'] ?? null;
    $check_mine = $_GET['check_mine'] ?? null;

    if ($check_mine) {
        $stmt = mysqli_prepare($conn, "
            SELECT id FROM blocked_users 
            WHERE blocker_id = ? AND blocked_id = ?
        ");
        mysqli_stmt_bind_param($stmt, "ii", $user1, $user2);
    } else {
        $stmt = mysqli_prepare($conn, "
            SELECT id FROM blocked_users 
            WHERE (blocker_id = ? AND blocked_id = ?)
            OR (blocker_id = ? AND blocked_id = ?)
        ");
        mysqli_stmt_bind_param($stmt, "iiii", $user1, $user2, $user2, $user1);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    echo json_encode(['blocked' => mysqli_num_rows($result) > 0]);
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);