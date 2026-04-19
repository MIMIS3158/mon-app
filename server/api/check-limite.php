<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id = $_GET['userId'] ?? null;

$eStmt = mysqli_prepare($conn, "
    SELECT e.id, u.is_premium 
    FROM entrepreneurs e 
    JOIN users u ON u.id = e.user_id 
    WHERE e.user_id = ?
");
mysqli_stmt_bind_param($eStmt, "i", $user_id);
mysqli_stmt_execute($eStmt);
mysqli_stmt_bind_result($eStmt, $entrepreneur_id, $is_premium);
mysqli_stmt_fetch($eStmt);
mysqli_stmt_close($eStmt);

if (!$entrepreneur_id) {
    echo json_encode(["error" => "Entrepreneur non trouvé"]);
    exit;
}

$stmt1 = mysqli_prepare($conn, "SELECT COUNT(*) FROM projects WHERE entrepreneur_id = ? AND Statut != 'terminé'");
mysqli_stmt_bind_param($stmt1, "i", $entrepreneur_id);
mysqli_stmt_execute($stmt1);
mysqli_stmt_bind_result($stmt1, $projets_actifs);
mysqli_stmt_fetch($stmt1);
mysqli_stmt_close($stmt1);

$stmt2 = mysqli_prepare($conn, "SELECT COUNT(*) FROM missions WHERE entrepreneur_id = ? AND statut != 'terminée'");
mysqli_stmt_bind_param($stmt2, "i", $entrepreneur_id);
mysqli_stmt_execute($stmt2);
mysqli_stmt_bind_result($stmt2, $missions_actives);
mysqli_stmt_fetch($stmt2);
mysqli_stmt_close($stmt2);

echo json_encode([
    'projets_actifs'   => (int)$projets_actifs,
    'missions_actives' => (int)$missions_actives,
    'is_premium'       => (bool)$is_premium,
]);

mysqli_close($conn);
?>