<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "freelance_db");

if (!$conn) {
    echo json_encode(["error" => "Erreur connexion"]);
    exit;
}

mysqli_set_charset($conn, "utf8");

$type = $_GET['type'] ?? null;
$userId = $_GET['userId'] ?? null;
$id_evalue = $_GET['id_evalue'] ?? null;

/* chercher id_evalue si seulement userId est envoyé */

if(!$id_evalue && $userId){

    if($type === "developpeur"){

        $stmt = mysqli_prepare($conn,"SELECT id FROM developers WHERE user_id=?");
        mysqli_stmt_bind_param($stmt,"i",$userId);

    }else{

        $stmt = mysqli_prepare($conn,"SELECT id FROM entrepreneurs WHERE user_id=?");
        mysqli_stmt_bind_param($stmt,"i",$userId);

    }

    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt,$id_evalue);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
}

if(!$id_evalue){
    echo json_encode([]);
    exit;
}

/* récupérer les évaluations 

$stmt = mysqli_prepare($conn,"
SELECT
e.note,
e.commentaire,
e.date_evaluation,
p.Nomduprojet
FROM evaluations e
JOIN projects p ON e.id_projet = p.id
WHERE e.id_evalue = ?
ORDER BY e.date_evaluation DESC
");*/
$stmt = mysqli_prepare($conn,"
SELECT 
e.note,
e.commentaire,
e.date_evaluation,
e.type_evaluateur,
e.id_evaluateur,
p.Nomduprojet
FROM evaluations e
JOIN projects p ON e.id_projet = p.id
WHERE e.id_evalue = ?
ORDER BY e.date_evaluation DESC
");

mysqli_stmt_bind_param($stmt,"i",$id_evalue);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$data = [];

while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

echo json_encode($data);


mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
<?php
/*
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "freelance_db");
mysqli_set_charset($conn, "utf8");

$type    = $_GET['type'] ?? null;
$user_id = $_GET['userId'] ?? null;
$id_evalue = $_GET['id_evalue'] ?? null;

// Si id_evalue non fourni, chercher depuis user_id
if (!$id_evalue && $user_id) {
    if ($type === 'developpeur') {
        $s = mysqli_prepare($conn, "SELECT id FROM developers WHERE user_id = ?");
    } else {
        $s = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
    }
    mysqli_stmt_bind_param($s, "i", $user_id);
    mysqli_stmt_execute($s);
    mysqli_stmt_bind_result($s, $id_evalue);
    mysqli_stmt_fetch($s);
    mysqli_stmt_close($s);
}

if (!$id_evalue) {
    echo json_encode([]);
    exit;
}

$stmt = mysqli_prepare($conn, "
    SELECT 
        e.note,
        e.commentaire,
        e.date_evaluation,
        e.type_evaluateur,
        p.Nomduprojet
    FROM evaluations e
    JOIN projects p ON e.id_projet = p.id
    WHERE e.id_evalue = ? AND e.type_evaluateur = ?
    ORDER BY e.date_evaluation DESC
");

mysqli_stmt_bind_param($stmt, "is", $id_evalue, $type);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$evaluations = [];
while ($row = mysqli_fetch_assoc($result)) {
    $evaluations[] = $row;
}

echo json_encode($evaluations);
mysqli_stmt_close($stmt);
mysqli_close($conn);*/
?>