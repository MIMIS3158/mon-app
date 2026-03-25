<?php
class Database
{
    private static $conn = null;

    public static function connect()
    {
        if (self::$conn === null) {
            //fixme: use en vars to hide sensitive data from the code
            // $conn = mysqli_connect(
            //     getenv("DB_HOST"),
            //     getenv("DB_USER"),
            //     getenv("DB_PASS"),
            //     getenv("DB_NAME")
            // );

            self::$conn = mysqli_connect("localhost", "root", "", "freelance_db");

            if (!self::$conn) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to connect to DB"]);
                exit;
            }

            mysqli_set_charset(self::$conn, "utf8");
        }

        return self::$conn;
    }
}