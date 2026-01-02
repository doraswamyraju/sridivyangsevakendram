<?php
$host = "localhost";
$db_name = "rajugda1_ssktrust_db"; 
$username = "rajugda1_adminssk";
$password = "BOHPM6139n@"; 

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
}
?>