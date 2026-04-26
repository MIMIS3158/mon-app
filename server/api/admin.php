<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($action) {

  case 'get_stats':
    $stats = [];
    $stats['total_users'] = $conn->query("SELECT COUNT(*) as c FROM users WHERE role != 'admin'")->fetch_assoc()['c'];
    $stats['total_devs'] = $conn->query("SELECT COUNT(*) as c FROM developers")->fetch_assoc()['c'];
    $stats['total_entrepreneurs'] = $conn->query("SELECT COUNT(*) as c FROM entrepreneurs")->fetch_assoc()['c'];
    $stats['total_projects'] = $conn->query("SELECT COUNT(*) as c FROM projects")->fetch_assoc()['c'];
    $stats['total_missions'] = $conn->query("SELECT COUNT(*) as c FROM missions")->fetch_assoc()['c'];
    $stats['total_reports'] = $conn->query("SELECT COUNT(*) as c FROM reports")->fetch_assoc()['c'];
    $stats['blocked_users'] = $conn->query("SELECT COUNT(*) as c FROM users WHERE is_blocked = 1")->fetch_assoc()['c'];
    echo json_encode($stats);
    break;

  case 'get_users':
    $sql = "SELECT u.id, u.Email as email, u.role, u.is_blocked,
                   COALESCE(d.Nomdev, e.Nom, 'N/A') as nom,
                   COALESCE(d.Prenomdev, e.Prenom, '') as prenom
            FROM users u
            LEFT JOIN developers d ON d.user_id = u.id
            LEFT JOIN entrepreneurs e ON e.user_id = u.id
            WHERE u.role != 'admin'
            ORDER BY u.id DESC";
    $result = $conn->query($sql);
    $users = [];
    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
    echo json_encode($users);
    break;

  case 'block_user':
    $user_id = $data['user_id'];
    $stmt = $conn->prepare("UPDATE users SET is_blocked = 1 WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  case 'unblock_user':
    $user_id = $data['user_id'];
    $stmt = $conn->prepare("UPDATE users SET is_blocked = 0 WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  case 'delete_user':
    $user_id = $data['user_id'];
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    break;

  case 'get_reports':
    $sql = "SELECT r.*,
                   COALESCE(d.Nomdev, e.Nom, 'N/A') as reporter_nom,
                   COALESCE(d2.Nomdev, e2.Nom, 'N/A') as reported_nom
            FROM reports r
            LEFT JOIN users u1 ON u1.id = r.reporter_id
            LEFT JOIN developers d ON d.user_id = u1.id
            LEFT JOIN entrepreneurs e ON e.user_id = u1.id
            LEFT JOIN users u2 ON u2.id = r.reported_id
            LEFT JOIN developers d2 ON d2.user_id = u2.id
            LEFT JOIN entrepreneurs e2 ON e2.user_id = u2.id
            ORDER BY r.created_at DESC";
    $result = $conn->query($sql);
    $reports = [];
    while ($row = $result->fetch_assoc()) {
      $reports[] = $row;
    }
    echo json_encode($reports);
    break;
}
$conn->close();
?>