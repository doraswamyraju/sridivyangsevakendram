<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once 'database.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET RESOURCES
if ($method == 'GET') {
    $stmt = $conn->prepare("SELECT * FROM resources ORDER BY created_at DESC");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($results as &$row) {
        if (!empty($row['file_path'])) {
            $row['file_path'] = str_replace(['http://localhost/sridivyangsevakendram.org', 'http://localhost'], 'https://sridivyangsevakendram.org', $row['file_path']);
        }
    }
    echo json_encode($results);
}

// 2. UPLOAD RESOURCE
if ($method == 'POST') {
    if (isset($_FILES['file']) && isset($_POST['title'])) {
        $title = $_POST['title'];
        $desc = $_POST['description'] ?? '';
        $target_dir = "../uploads/";
        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);

        $file_ext = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
        $filename = uniqid() . "_doc." . $file_ext;
        $target_file = $target_dir . $filename;

        // Dynamic URL
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
        $host = $_SERVER['HTTP_HOST'];
        $path_prefix = ($host === 'localhost') ? "/sridivyangsevakendram.org" : "";
        $file_url = $protocol . "://" . $host . $path_prefix . "/uploads/" . $filename;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            $stmt = $conn->prepare("INSERT INTO resources (title, description, file_path) VALUES (?, ?, ?)");
            if($stmt->execute([$title, $desc, $file_url])) {
                echo json_encode(["message" => "Uploaded successfully"]);
            } else { http_response_code(500); echo json_encode(["message" => "Database error"]); }
        } else { http_response_code(500); echo json_encode(["message" => "File upload failed"]); }
    } else { http_response_code(400); echo json_encode(["message" => "Missing fields"]); }
}

// 3. DELETE RESOURCE
if ($method == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->id)) {
        $stmt = $conn->prepare("SELECT file_path FROM resources WHERE id = ?");
        $stmt->execute([$data->id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $url_path = parse_url($row['file_path'], PHP_URL_PATH);
            $relative_path = str_replace("/sridivyangsevakendram.org/", "", $url_path);
            $file_to_delete = "../" . ltrim($relative_path, '/');
            if (file_exists($file_to_delete)) unlink($file_to_delete);
            
            $del = $conn->prepare("DELETE FROM resources WHERE id = ?");
            $del->execute([$data->id]);
            echo json_encode(["message" => "Deleted"]);
        }
    }
}
?>