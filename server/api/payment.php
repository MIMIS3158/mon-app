<?php
/*
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user_id    = $data['user_id'] ?? null;
    $plan       = $data['plan'] ?? null;
    $pay_method = $data['method'] ?? null;

    if (!$user_id || !$plan) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $plans = [
        'monthly'   => ['price' => 990,  'days' => 30],
        'quarterly' => ['price' => 2490, 'days' => 90],
        'yearly'    => ['price' => 7190, 'days' => 365],
    ];

    if (!isset($plans[$plan])) {
        echo json_encode(['error' => 'Plan invalide']);
        exit;
    }

    $amount  = $plans[$plan]['price'];
    $days    = $plans[$plan]['days'];
    $expires = date('Y-m-d H:i:s', strtotime("+{$days} days"));

    // Enregistrer le paiement
    $stmt = mysqli_prepare($conn, "
        INSERT INTO payments (user_id, plan, amount, method, status, expires_at, created_at)
        VALUES (?, ?, ?, ?, 'completed', ?, NOW())
    ");
    mysqli_stmt_bind_param($stmt, "isdss", $user_id, $plan, $amount, $pay_method, $expires);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Activer le premium
    $stmt2 = mysqli_prepare($conn, "
        UPDATE users SET is_premium = 1, premium_expires_at = ? WHERE id = ?
    ");
    mysqli_stmt_bind_param($stmt2, "si", $expires, $user_id);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_close($stmt2);

    echo json_encode([
        'success'    => true,
        'expires_at' => $expires,
        'message'    => 'Abonnement activé avec succès'
    ]);

} elseif ($method === 'GET') {
    $user_id = $_GET['userId'] ?? null;
    if (!$user_id) { echo json_encode([]); exit; }

    $stmt = mysqli_prepare($conn, "
        SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC
    ");
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $payments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $payments[] = $row;
    }
    echo json_encode($payments);
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
*/
/*
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user_id    = $data['user_id'] ?? null;
    $plan       = $data['plan'] ?? null;
    $pay_method = $data['method'] ?? null;

    if (!$user_id || !$plan) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $plans = [
        'monthly'   => ['price' => 990,  'days' => 30],
        'quarterly' => ['price' => 2490, 'days' => 90],
        'yearly'    => ['price' => 7190, 'days' => 365],
    ];

    if (!isset($plans[$plan])) {
        echo json_encode(['error' => 'Plan invalide']);
        exit;
    }

    $amount  = $plans[$plan]['price'];
    $days    = $plans[$plan]['days'];
    $expires = date('Y-m-d H:i:s', strtotime("+{$days} days"));

    // Enregistrer le paiement en attente (pending)
    $stmt = mysqli_prepare($conn, "
        INSERT INTO payments (user_id, plan, amount, method, status, expires_at, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?, NOW())
    ");
    mysqli_stmt_bind_param($stmt, "isdss", $user_id, $plan, $amount, $pay_method, $expires);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // PAS D'ACTIVATION AUTOMATIQUE — is_premium reste à 0

    echo json_encode([
        'success' => true,
        'message' => 'Demande envoyée, en attente de validation'
    ]);

} elseif ($method === 'GET') {
    $user_id = $_GET['userId'] ?? null;
    if (!$user_id) { echo json_encode([]); exit; }

    $stmt = mysqli_prepare($conn, "
        SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC
    ");
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $payments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $payments[] = $row;
    }
    echo json_encode($payments);
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);*/


require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user_id    = $data['user_id'] ?? null;
    $plan       = $data['plan'] ?? null;
    $pay_method = $data['method'] ?? null;

    if (!$user_id || !$plan) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        exit;
    }

    $plans = [
        'monthly'   => ['price' => 990,  'days' => 30],
        'quarterly' => ['price' => 2490, 'days' => 90],
        'yearly'    => ['price' => 7190, 'days' => 365],
    ];

    if (!isset($plans[$plan])) {
        echo json_encode(['error' => 'Plan invalide']);
        exit;
    }

    $amount  = $plans[$plan]['price'];
    $days    = $plans[$plan]['days'];
    $expires = date('Y-m-d H:i:s', strtotime("+{$days} days"));

    // Enregistrer le paiement
    $stmt = mysqli_prepare($conn, "
        INSERT INTO payments (user_id, plan, amount, method, status, expires_at, created_at)
        VALUES (?, ?, ?, ?, 'completed', ?, NOW())
    ");
    mysqli_stmt_bind_param($stmt, "isdss", $user_id, $plan, $amount, $pay_method, $expires);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Activer le premium
    $stmt2 = mysqli_prepare($conn, "
        UPDATE users SET is_premium = 1, premium_expires_at = ? WHERE id = ?
    ");
    mysqli_stmt_bind_param($stmt2, "si", $expires, $user_id);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_close($stmt2);

    echo json_encode([
        'success'    => true,
        'expires_at' => $expires,
        'message'    => 'Abonnement activé avec succès'
    ]);

} elseif ($method === 'GET') {
    $user_id = $_GET['userId'] ?? null;
    if (!$user_id) { echo json_encode([]); exit; }

    $stmt = mysqli_prepare($conn, "
        SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC
    ");
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $payments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $payments[] = $row;
    }
    echo json_encode($payments);
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>