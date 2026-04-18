<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

header('Content-Type: application/json');

$userId = intval($_GET['userId'] ?? 0);

if ($userId === 0) {
    echo json_encode(["error" => "Pas d'userId"]);
    exit;
}

// ÉTAPE 1 : Trouver l'ID du développeur à partir de l'ID user
$sqlDev = "SELECT id, Niveau FROM developers WHERE user_id = ?";
$stmtDev = mysqli_prepare($conn, $sqlDev);
mysqli_stmt_bind_param($stmtDev, "i", $userId);
mysqli_stmt_execute($stmtDev);
$resultDev = mysqli_stmt_get_result($stmtDev);
$dev = mysqli_fetch_assoc($resultDev);
mysqli_stmt_close($stmtDev);

if (!$dev) {
    echo json_encode([
        "error" => "Développeur non trouvé",
        "total" => 0, "terminees" => 0, "refusees" => 0, "encours" => 0,
        "moyenne" => 0, "total_evals" => 0, "niveau" => "Junior"
    ]);
    exit;
}

$devId = $dev['id']; // ← C'est CET ID qu'on utilise pour les candidatures !

// Convertir le niveau
$niveauDev = $dev['Niveau'] ?? 'junior';
$niveauAffichage = 'Junior';
if ($niveauDev === 'senior') $niveauAffichage = 'Senior';
elseif ($niveauDev === 'mid') $niveauAffichage = 'Intermédiaire';

// ÉTAPE 2 : Compter les candidatures avec le BON ID
$sql = "SELECT statut FROM candidatures WHERE developpeur_id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $devId); // ← $devId ici !
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$total = 0;
$terminees = 0;
$refusees = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $total++;
    $statut = strtolower($row['statut']);
    
    if (strpos($statut, 'termin') !== false) {
        $terminees++;
    } elseif (strpos($statut, 'refus') !== false) {
        $refusees++;
    }
}

$encours = $total - $terminees - $refusees;
mysqli_stmt_close($stmt);

// ÉTAPE 3 : Les évaluations (id_evalue = devId aussi normalement)
$sql2 = "SELECT ROUND(AVG(note), 1) as moyenne, COUNT(*) as total_evals 
         FROM evaluations 
         WHERE id_evalue = ? AND type_evaluateur = 'entrepreneur'";
$stmt2 = mysqli_prepare($conn, $sql2);
mysqli_stmt_bind_param($stmt2, "i", $devId);
mysqli_stmt_execute($stmt2);
$result2 = mysqli_stmt_get_result($stmt2);
$evals = mysqli_fetch_assoc($result2);
mysqli_stmt_close($stmt2);

// Réponse
echo json_encode([
    "total"       => $total,
    "terminees"   => $terminees,
    "refusees"    => $refusees,
    "encours"     => $encours,
    "moyenne"     => $evals['moyenne'] ? floatval($evals['moyenne']) : 0,
    "total_evals" => intval($evals['total_evals'] ?? 0),
    "niveau"      => $niveauAffichage,
    "debug_dev_id"=> $devId // ← Pour vérifier, vous pouvez l'enlever après
]);

mysqli_close($conn);
?>