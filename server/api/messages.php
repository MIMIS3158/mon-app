<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$uploadDir = __DIR__ . '/../uploads/messages/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $sender_id   = $_GET['sender_id'] ?? null;
    $receiver_id = $_GET['receiver_id'] ?? null;
    $last_msg_id = isset($_GET['last_msg_id']) ? (int) $_GET['last_msg_id'] : null;

    if (!$sender_id || !$receiver_id) {
        echo json_encode([]);
        exit;
    }

    if ($last_msg_id !== null && $last_msg_id > 0) {
        $stmt = mysqli_prepare($conn, "
            SELECT m.*,
                   u1.Nom as sender_nom,
                   u2.Nom as receiver_nom
            FROM messages m
            JOIN users u1 ON m.sender_id = u1.id
            JOIN users u2 ON m.receiver_id = u2.id
            WHERE (
                    (m.sender_id = ? AND m.receiver_id = ?)
                 OR (m.sender_id = ? AND m.receiver_id = ?)
            )
            AND m.id > ?
            ORDER BY m.date_envoi ASC
        ");
        mysqli_stmt_bind_param($stmt, "iiiii", $sender_id, $receiver_id, $receiver_id, $sender_id, $last_msg_id);
    } else {
        $stmt = mysqli_prepare($conn, "
            SELECT m.*,
                   u1.Nom as sender_nom,
                   u2.Nom as receiver_nom
            FROM messages m
            JOIN users u1 ON m.sender_id = u1.id
            JOIN users u2 ON m.receiver_id = u2.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.date_envoi ASC
        ");
        mysqli_stmt_bind_param($stmt, "iiii", $sender_id, $receiver_id, $receiver_id, $sender_id);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $messages = [];
    while ($row = mysqli_fetch_assoc($result)) {
        if (!empty($row['fichier'])) {
            $row['fichier'] = getEnvVar("APP_URL") . '/' . $row['fichier'];
        }
        $messages[] = $row;
    }
    mysqli_stmt_close($stmt);
    
    $update = mysqli_prepare($conn, "
        UPDATE messages SET lu = 1 
        WHERE receiver_id = ? AND sender_id = ? AND lu = 0
    ");
    mysqli_stmt_bind_param($update, "ii", $sender_id, $receiver_id);
    mysqli_stmt_execute($update);
    mysqli_stmt_close($update);
    echo json_encode($messages);
}



else if ($method === 'POST') {
    $sender_id   = null;
    $receiver_id = null;
    $project_id  = null;
    $message     = '';
    $fichier     = null;
    $type_fichier = null;
    if (!empty($_FILES)) {
        $sender_id   = $_POST['sender_id'] ?? null;
        $receiver_id = $_POST['receiver_id'] ?? null;
        $project_id  = $_POST['project_id'] ?? null;
        $mission_id  = $data['mission_id'] ?? null;
        $message     = trim($_POST['message'] ?? '');
        if (!empty($_FILES['fichier']['name'])) {
            $ext = strtolower(pathinfo($_FILES['fichier']['name'], PATHINFO_EXTENSION));
            $allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif'];
            $allowedDocs   = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
            
            if (in_array($ext, $allowedImages)) {
                $type_fichier = 'image';
            } elseif (in_array($ext, $allowedDocs)) {
                $type_fichier = 'document';
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Type de fichier non autorisé"]);
                exit;
            }

            $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            if (move_uploaded_file($_FILES['fichier']['tmp_name'], $uploadDir . $filename)) {
                $fichier = 'uploads/messages/' . $filename;
            }
        }
    } else {
        $data        = json_decode(file_get_contents("php://input"), true);
        $sender_id   = $data['sender_id'] ?? null;
        $receiver_id = $data['receiver_id'] ?? null;
        $project_id  = $data['project_id'] ?? null;
        
        $message     = trim($data['message'] ?? '');
        
        
        if (!empty($data['localisation'])) {
            $type_fichier = 'location';
            $message = $data['localisation'];
        }
    }

    if (!$sender_id || !$receiver_id) {
        http_response_code(400);
        echo json_encode(["error" => "Données manquantes"]);
        exit;
    }

    /*if ($message === '' && !$fichier) {
        http_response_code(400);
        echo json_encode(["error" => "Message ou fichier requis"]);
        exit;
    }*/
        if ($message === '' && !$fichier && $type_fichier !== 'location') {
    http_response_code(400);
    echo json_encode(["error" => "Message ou fichier requis"]);
    exit;
}
   

    if (empty($project_id) || $project_id == 0) $project_id = null;

    $stmt = mysqli_prepare($conn, "
        INSERT INTO messages (sender_id, receiver_id, project_id, message, fichier, type_fichier, date_envoi, lu)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), 0)
    ");
    mysqli_stmt_bind_param($stmt, "iiisss", 
        $sender_id, $receiver_id, $project_id, 
        $message, $fichier, $type_fichier
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "message" => "Message envoyé"]);
    } else {
        error_log(mysqli_error($conn));
        echo json_encode(["error" => "Une erreur est survenue lors de l'envoi du message"]);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>