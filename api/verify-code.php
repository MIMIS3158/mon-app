<?php
/*
session_start();

if (isset($_POST['code'])) {
    $code = $_POST['code'];

    if (isset($_SESSION['reset_code']) && $_SESSION['reset_code'] == $code) {
        // Vérifier expiration (10 min)
        if (time() - $_SESSION['code_time'] <= 600) {
            $_SESSION['verified'] = true;
            echo "Code vérifié. Vous pouvez maintenant réinitialiser votre mot de passe.";
        } else {
            echo "Code expiré. Veuillez demander un nouveau code.";
        }
    } else {
        echo "Code incorrect";
    }
} else {
    echo "Veuillez entrer le code reçu";
}*/
?>
