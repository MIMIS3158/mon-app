<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$conn = new mysqli("localhost", "root", "", "freelance_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}
$dev_id = isset($_GET['devId']) ? intval($_GET['devId']) : 0;
if ($dev_id === 0) {
    echo json_encode(["error" => "devId manquant"]);
    exit;
}
$compDev = [];
$devRes = $conn->query("SELECT CompetencesTechniques FROM developers WHERE user_id = $dev_id");
if ($devRes && $devRes->num_rows > 0) {
    $row = $devRes->fetch_assoc();
    $raw = strtolower($row['CompetencesTechniques'] ?? '');
    $raw = str_replace([';', '|', '/'], ',', $raw);
    $compDev = array_filter(array_map('trim', explode(',', $raw)));
}
$projets = [];
$res = $conn->query("
    SELECT id, Nomduprojet, Budget, Duree, Competences
    FROM projects
    WHERE Statut = 'en attente'
");
if ($res) {
    while ($p = $res->fetch_assoc()) {
        $raw = strtolower($p['Competences'] ?? '');
        $raw = str_replace([';', '|', '/'], ',', $raw);
        $compProjet = array_filter(array_map('trim', explode(',', $raw)));
        $matched = [];
        $notMatched = [];
        $score = 0;
        if (!empty($compDev)) {
            foreach ($compProjet as $cp) {
                if (in_array($cp, $compDev)) {
                    $matched[] = $cp;
                } else {
                    $notMatched[] = $cp;
                }
            }
            $total = count($compProjet);
            $score = $total > 0 ? round((count($matched) / $total) * 100) : 0;
        }
        if ($score >= 50) {
            $projets[] = [
                'id' => $p['id'],
                'nom' => $p['Nomduprojet'],
                'budget' => $p['Budget'],
                'duree' => $p['Duree'],
                'score' => $score,
                'matched' => array_values($matched),
                'notMatched' => array_values($notMatched)
            ];
        }
    }
}
usort($projets, fn($a, $b) => $b['score'] - $a['score']);
echo json_encode(array_values($projets));
$conn->close();
?>