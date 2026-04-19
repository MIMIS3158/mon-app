<?php
/*
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$conn = Database::connect();
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $page  = isset($_GET['page'])  ? (int)$_GET['page']  : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

    // Récupérer entrepreneur_id si userId fourni
    $entrepreneurFilter = '';
    if ($userId > 0) {
        $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
        mysqli_stmt_bind_param($eStmt, "i", $userId);
        mysqli_stmt_execute($eStmt);
        mysqli_stmt_bind_result($eStmt, $eid);
        mysqli_stmt_fetch($eStmt);
        mysqli_stmt_close($eStmt);
        if ($eid) $entrepreneurFilter = " WHERE w.entrepreneur_id = " . intval($eid);
    }

    $totalResult = mysqli_query($conn, "SELECT COUNT(*) as total FROM workshops w" . $entrepreneurFilter);
    $totalRow    = mysqli_fetch_assoc($totalResult);
    $total       = $totalRow['total'];

    $stmt = mysqli_prepare($conn, "
        SELECT w.id, w.title, w.description, w.thumbnail, w.video_url,
               w.duration, w.date, w.price, w.order_num,
               w.max_participants, w.is_free,
               COUNT(wp.id) as participants,
               CONCAT(u.nom, ' ', u.prenom) as entrepreneur_name
        FROM workshops w
        LEFT JOIN workshop_participants wp ON w.id = wp.workshop_id
        LEFT JOIN entrepreneurs e ON w.entrepreneur_id = e.id
        LEFT JOIN users u ON e.user_id = u.id
        $entrepreneurFilter
        GROUP BY w.id
        ORDER BY w.order_num ASC, w.date DESC
        LIMIT ? OFFSET ?
    ");
    mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $workshops = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $workshops[] = [
            'id'               => (int)$row['id'],
            'title'            => $row['title'],
            'description'      => $row['description'],
            'thumbnail'        => $row['thumbnail'] ?: 'assets/workshop-default.jpg',
            'video_url'        => $row['video_url'],
            'duration'         => $row['duration'],
            'date'             => $row['date'],
            'price'            => (float)$row['price'],
            'order_num'        => (int)$row['order_num'],
            'max_participants' => (int)$row['max_participants'],
            'participants'     => (int)$row['participants'],
            'is_free'          => (bool)$row['is_free'],
            'entrepreneur_name'=> $row['entrepreneur_name'],
        ];
    }
    mysqli_stmt_close($stmt);

    echo json_encode([
        'workshops' => $workshops,
        'total'     => (int)$total,
        'page'      => $page,
        'pages'     => ceil($total / $limit)
    ]);
}



   

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user_id     = $data['user_id'] ?? null;
    $title       = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $video_url   = $data['video_url'] ?? null;
    $duration    = $data['duration'] ?? null;
    $date        = $data['date'] ?? null;
    $price       = $data['price'] ?? 0;
    $max_part    = $data['max_participants'] ?? 50;
    $is_free     = $data['is_free'] ?? false;

    if (!$user_id || !$title || !$description) {
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        exit;
    }

  
    $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($eStmt, "i", $user_id);
    mysqli_stmt_execute($eStmt);
    mysqli_stmt_bind_result($eStmt, $entrepreneur_id);
    mysqli_stmt_fetch($eStmt);
    mysqli_stmt_close($eStmt);

    if (!$entrepreneur_id) {
        echo json_encode(['error' => 'Entrepreneur non trouvé']);
        exit;
    }

    
    $orderResult = mysqli_query($conn, "SELECT MAX(order_num) as max_order FROM workshops");
    $orderRow    = mysqli_fetch_assoc($orderResult);
    $order_num   = ($orderRow['max_order'] ?? 0) + 1;

    $stmt = mysqli_prepare($conn, "
        INSERT INTO workshops 
        (entrepreneur_id, title, description, video_url, duration, date, price, order_num, max_participants, is_free)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $is_free_int = $is_free ? 1 : 0;
    mysqli_stmt_bind_param($stmt, "isssssdiis",
        $entrepreneur_id, $title, $description,
        $video_url, $duration, $date,
        $price, $order_num, $max_part, $is_free_int
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'id' => mysqli_insert_id($conn)]);
    } else {
        echo json_encode(['error' => 'Erreur lors de la création']);
    }
    mysqli_stmt_close($stmt);
}

elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        echo json_encode(['error' => 'ID invalide']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "DELETE FROM workshops WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur suppression']);
    }
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);*/

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$conn = Database::connect();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET par workshopId (pour édition)
    if (isset($_GET['workshopId'])) {
        $id = intval($_GET['workshopId']);
        $stmt = mysqli_prepare($conn, "SELECT * FROM workshops WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $workshop = mysqli_fetch_assoc($result);
        echo json_encode($workshop);
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
        exit;
    }

    $page  = isset($_GET['page'])  ? (int)$_GET['page']  : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

    $entrepreneurFilter = '';
    if ($userId > 0) {
        $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
        mysqli_stmt_bind_param($eStmt, "i", $userId);
        mysqli_stmt_execute($eStmt);
        mysqli_stmt_bind_result($eStmt, $eid);
        mysqli_stmt_fetch($eStmt);
        mysqli_stmt_close($eStmt);
        if ($eid) $entrepreneurFilter = " WHERE w.entrepreneur_id = " . intval($eid);
    }

    $totalResult = mysqli_query($conn, "SELECT COUNT(*) as total FROM workshops w" . $entrepreneurFilter);
    $totalRow    = mysqli_fetch_assoc($totalResult);
    $total       = $totalRow['total'];

    $stmt = mysqli_prepare($conn, "
        SELECT w.id, w.title, w.description, w.thumbnail, w.video_url,
               w.duration, w.date, w.price, w.order_num,
               w.max_participants, w.is_free,
               COUNT(wp.id) as participants,
               CONCAT(u.nom, ' ', u.prenom) as entrepreneur_name
        FROM workshops w
        LEFT JOIN workshop_participants wp ON w.id = wp.workshop_id
        LEFT JOIN entrepreneurs e ON w.entrepreneur_id = e.id
        LEFT JOIN users u ON e.user_id = u.id
        $entrepreneurFilter
        GROUP BY w.id
        ORDER BY w.order_num ASC, w.date DESC
        LIMIT ? OFFSET ?
    ");
    mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $workshops = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $workshops[] = [
            'id'               => (int)$row['id'],
            'title'            => $row['title'],
            'description'      => $row['description'],
            'thumbnail'        => $row['thumbnail'] ?: 'assets/workshop-default.jpg',
            'video_url'        => $row['video_url'],
            'duration'         => $row['duration'],
            'date'             => $row['date'],
            'price'            => (float)$row['price'],
            'order_num'        => (int)$row['order_num'],
            'max_participants' => (int)$row['max_participants'],
            'participants'     => (int)$row['participants'],
            'is_free'          => (bool)$row['is_free'],
            'entrepreneur_name'=> $row['entrepreneur_name'],
        ];
    }
    mysqli_stmt_close($stmt);

    echo json_encode([
        'workshops' => $workshops,
        'total'     => (int)$total,
        'page'      => $page,
        'pages'     => ceil($total / $limit)
    ]);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user_id     = $data['user_id'] ?? null;
    $title       = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $video_url   = $data['video_url'] ?? null;
    $duration    = $data['duration'] ?? null;
    $date        = $data['date'] ?? null;
    $price       = $data['price'] ?? 0;
    $max_part    = $data['max_participants'] ?? 50;
    $is_free     = $data['is_free'] ?? false;

    if (!$user_id || !$title || !$description) {
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        exit;
    }

    $eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    mysqli_stmt_bind_param($eStmt, "i", $user_id);
    mysqli_stmt_execute($eStmt);
    mysqli_stmt_bind_result($eStmt, $entrepreneur_id);
    mysqli_stmt_fetch($eStmt);
    mysqli_stmt_close($eStmt);

    if (!$entrepreneur_id) {
        echo json_encode(['error' => 'Entrepreneur non trouvé']);
        exit;
    }

    $orderResult = mysqli_query($conn, "SELECT MAX(order_num) as max_order FROM workshops");
    $orderRow    = mysqli_fetch_assoc($orderResult);
    $order_num   = ($orderRow['max_order'] ?? 0) + 1;

    $stmt = mysqli_prepare($conn, "
        INSERT INTO workshops 
        (entrepreneur_id, title, description, video_url, duration, date, price, order_num, max_participants, is_free)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $is_free_int = $is_free ? 1 : 0;
    mysqli_stmt_bind_param($stmt, "isssssdiis",
        $entrepreneur_id, $title, $description,
        $video_url, $duration, $date,
        $price, $order_num, $max_part, $is_free_int
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'id' => mysqli_insert_id($conn)]);
    } else {
        echo json_encode(['error' => 'Erreur lors de la création']);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'PUT') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $data = json_decode(file_get_contents('php://input'), true);

    $title       = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $video_url   = $data['video_url'] ?? null;
    $duration    = $data['duration'] ?? null;
    $date        = $data['date'] ?? null;
    $price       = $data['price'] ?? 0;
    $max_part    = $data['max_participants'] ?? 50;
    $is_free     = $data['is_free'] ?? false;
    $is_free_int = $is_free ? 1 : 0;

    $stmt = mysqli_prepare($conn, "
        UPDATE workshops SET
        title = ?, description = ?, video_url = ?,
        duration = ?, date = ?, price = ?,
        max_participants = ?, is_free = ?
        WHERE id = ?
    ");
    mysqli_stmt_bind_param($stmt, "ssssssdii",
        $title, $description, $video_url,
        $duration, $date, $price,
        $max_part, $is_free_int, $id
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur modification']);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        echo json_encode(['error' => 'ID invalide']);
        exit;
    }
    $stmt = mysqli_prepare($conn, "DELETE FROM workshops WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur suppression']);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>
