<?php
// --- 1. CORS HEADERS (Crucial for React connection) ---
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once 'database.php';

$type = isset($_GET['type']) ? $_GET['type'] : '';

// --- 2. FETCH DONATIONS ---
if ($type == 'donations') {
    try {
        // Matches your phpMyAdmin table: 'donations'
        $query = "SELECT * FROM donations ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error fetching donations", "error" => $e->getMessage()]);
    }
}

// --- 3. FETCH VOLUNTEERS ---
elseif ($type == 'volunteers') {
    try {
        // Matches your expected table: 'volunteers'
        $query = "SELECT * FROM volunteers ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error fetching volunteers", "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Invalid Request Type"]);
}
?>