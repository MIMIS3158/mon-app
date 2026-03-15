<?php /*
session_start();
require 'db.php';

if (isset($_POST['email'])) {
    $email = $_POST['email'];

    // Vérifie si l'utilisateur existe dans la table users
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $code = rand(100000, 999999);
        $_SESSION['reset_code'] = $code;
        $_SESSION['reset_email'] = $email;
        $_SESSION['code_time'] = time();

        $subject = "Code de réinitialisation";
        $message = "Votre code pour réinitialiser le mot de passe est : $code";
        $headers = "From: no-reply@freelance.local";

        if (mail($email, $subject, $message, $headers)) {
            echo json_encode(["success" => true, "message" => "Code envoyé"]);
        } else {
            echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi du mail"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Email non trouvé"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Veuillez entrer votre email"]);
}*/
?>
