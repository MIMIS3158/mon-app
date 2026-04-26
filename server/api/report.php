<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$data = json_decode(file_get_contents('php://input'), true);

$reporter_id = $data['reporter_id'];
$reported_id = $data['reported_id'];
$raison      = $data['raison'];
$description = $data['description'] ?? '';

$stmt = $conn->prepare(
  "INSERT INTO reports (reporter_id, reported_id, raison, description) 
   VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("iiss", $reporter_id, $reported_id, $raison, $description);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'error' => 'Erreur']);
}
$conn->close();
?>