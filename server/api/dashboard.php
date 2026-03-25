<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
$conn = Database::connect();

$user_id = $_GET['userId'] ?? null;
$eStmt = mysqli_prepare($conn, "SELECT id FROM entrepreneurs WHERE user_id = ?");
mysqli_stmt_bind_param($eStmt, "i", $user_id);
mysqli_stmt_execute($eStmt);
mysqli_stmt_bind_result($eStmt, $entrepreneur_id);
mysqli_stmt_fetch($eStmt);
mysqli_stmt_close($eStmt);
if (!$entrepreneur_id) {
    echo json_encode(["error" => "Entrepreneur non trouvé"]);
    exit;
}
$stmt = mysqli_prepare($conn, "
    SELECT COUNT(*) 
    FROM candidatures c
    JOIN projects p ON c.project_id = p.id
    WHERE p.entrepreneur_id = ?
");
mysqli_stmt_bind_param($stmt, "i", $entrepreneur_id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $total_interesses);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);
$stmt = mysqli_prepare($conn, "
    SELECT Competences 
    FROM projects 
    WHERE entrepreneur_id = ? AND Competences IS NOT NULL
");
mysqli_stmt_bind_param($stmt, "i", $entrepreneur_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$competences_requises = [];
while ($row = mysqli_fetch_assoc($result)) {
    $comps = array_map('trim', explode(',', $row['Competences']));
    $competences_requises = array_merge($competences_requises, $comps);
}
$competences_requises = array_unique(array_filter($competences_requises));
mysqli_stmt_close($stmt);
$total_devs = 0;
$matching_devs = 0;
$allDevs = mysqli_query($conn, "SELECT CompetencesTechniques FROM developers WHERE CompetencesTechniques IS NOT NULL");
while ($dev = mysqli_fetch_assoc($allDevs)) {
    $total_devs++;
    $dev_comps = array_map('trim', explode(',', $dev['CompetencesTechniques']));
    if (count($competences_requises) > 0) {
        $matches = 0;
        foreach ($competences_requises as $comp) {
            foreach ($dev_comps as $dev_comp) {
                if (stripos($dev_comp, $comp) !== false || stripos($comp, $dev_comp) !== false) {
                    $matches++;
                    break;
                }
            }
        }
        $score = ($matches / count($competences_requises)) * 100;
        if ($score >= 80) $matching_devs++;
    }
}
$competences_stats = [];
$allDevsComp = mysqli_query($conn, "SELECT CompetencesTechniques FROM developers WHERE CompetencesTechniques IS NOT NULL");
$all_comps = [];
while ($dev = mysqli_fetch_assoc($allDevsComp)) {
    $comps = array_map('trim', explode(',', $dev['CompetencesTechniques']));
    foreach ($comps as $comp) {
        if ($comp) $all_comps[] = strtolower($comp);
    }
}
$comp_counts = array_count_values($all_comps);
arsort($comp_counts);
$top_comps = array_slice($comp_counts, 0, 6, true);
foreach ($top_comps as $comp => $count) {
    $competences_stats[] = [
        'nom' => ucfirst($comp),
        'count' => $count,
        'pourcentage' => $total_devs > 0 ? round(($count / $total_devs) * 100) : 0
    ];
}
echo json_encode([
    'interesses' => $total_interesses,
    'matching_devs' => $matching_devs,
    'total_devs' => $total_devs,
    'competences' => $competences_stats
]);
mysqli_close($conn);
