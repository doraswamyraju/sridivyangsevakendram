<?php
$host = "localhost";
$db_name = "u_ssktrust_db"; // Must match your phpMyAdmin name exactly
$username = "root";         // Default XAMPP username
$password = "";             // Default XAMPP password (leave empty)

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
?>