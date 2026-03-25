<?php

$env = parse_ini_file(__DIR__ . '/../.env');

function getEnvVar($key, $default = null)
{
    global $env;
    return $env[$key] ?? $default;
}

class Database
{
    private static $conn = null;

    public static function connect()
    {
        if (self::$conn === null) {
            self::$conn = mysqli_connect(
                getEnvVar('DB_HOST'),
                getEnvVar('DB_USER'),
                getEnvVar('DB_PASS'),
                getEnvVar('DB_NAME')
            );

            // self::$conn = mysqli_connect("localhost", "root", "", "freelance_db");

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
