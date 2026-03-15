<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
mysqli_set_charset($conn, "utf8");

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

$stmt = mysqli_prepare($conn, "
    SELECT 
        m.id,
        m.message as last_message,
        m.date_envoi,
        m.lu,
        m.sender_id,
        m.receiver_id,
        CASE 
            WHEN m.sender_id = ? THEN m.receiver_id 
            ELSE m.sender_id 
        END as contact_id,
        u.Nom as contact_nom,
        u.Prenom as contact_prenom,
        u.role as contact_role,
        (SELECT COUNT(*) FROM messages 
         WHERE receiver_id = ? AND sender_id = CASE 
            WHEN m.sender_id = ? THEN m.receiver_id 
            ELSE m.sender_id END AND lu = 0) as unread_count
    FROM messages m
    JOIN users u ON u.id = CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id END
    WHERE (m.sender_id = ? OR m.receiver_id = ?)
    AND m.id = (
        SELECT MAX(m2.id) FROM messages m2
        WHERE (m2.sender_id = ? AND m2.receiver_id = CASE 
            WHEN m.sender_id = ? THEN m.receiver_id 
            ELSE m.sender_id END)
        OR (m2.receiver_id = ? AND m2.sender_id = CASE 
            WHEN m.sender_id = ? THEN m.receiver_id 
            ELSE m.sender_id END)
    )
    ORDER BY m.date_envoi DESC
");

mysqli_stmt_bind_param($stmt, "iiiiiiiiii",
    $user_id, $user_id, $user_id,
    $user_id, $user_id, $user_id,
    $user_id, $user_id, $user_id, $user_id
);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$conversations = [];
while ($row = mysqli_fetch_assoc($result)) {
    $conversations[] = $row;
}

echo json_encode($conversations);
mysqli_close($conn);
?>