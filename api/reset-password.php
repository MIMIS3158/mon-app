<?php
/*
session_start();
require 'db.php'; // ton fichier de connexion à la base

if (!isset($_SESSION['verified']) || $_SESSION['verified'] !== true) {
    die("Accès interdit");
}

if (isset($_POST['password'])) {
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $_SESSION['reset_email'];

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $password, $email);

    if ($stmt->execute()) {
        echo "Mot de passe réinitialisé avec succès";
        // On détruit les sessions après usage
        session_unset();
        session_destroy();
    } else {
        echo "Erreur lors de la mise à jour du mot de passe";
    }
} else {
    echo "Veuillez entrer un nouveau mot de passe";
}*/
?>
