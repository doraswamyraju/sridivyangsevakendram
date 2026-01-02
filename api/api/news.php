<?php
// CORS Headers
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
$PROJECT_FOLDER = "sridivyangsevakendram.org"; // Match your folder name

// 1. GET NEWS
if ($method == 'GET') {
    $query = "SELECT * FROM news_updates ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// 2. POST NEWS (Title, Content, Image)
if ($method == 'POST') {
    if (isset($_FILES['image']) && isset($_POST['title']) && isset($_POST['content'])) {
        $title = $_POST['title'];
        $content = $_POST['content'];
        $target_dir = "../uploads/";
        
        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);

        $file_ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
        $filename = uniqid() . "_news." . $file_ext;
        $target_file = $target_dir . $filename;
        // Automatically detect if it's localhost or live server
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
$host = $_SERVER['HTTP_HOST'];

// Fix for your specific folder structure
// If on localhost, include the folder name. If on live, just use root.
$path_prefix = ($host === 'localhost') ? "/sridivyangsevakendram.org" : "";

$image_url = $protocol . "://" . $host . $path_prefix . "/uploads/" . $filename;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $query = "INSERT INTO news_updates (title, content, image_path) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            if($stmt->execute([$title, $content, $image_url])) {
                echo json_encode(["message" => "News posted successfully"]);
            } else {
                http_response_code(500); echo json_encode(["message" => "Database error"]);
            }
        } else {
            http_response_code(500); echo json_encode(["message" => "Image upload failed"]);
        }
    } else {
        http_response_code(400); echo json_encode(["message" => "Missing fields"]);
    }
}

// 3. DELETE NEWS
if ($method == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->id)) {
        // Get image path to delete file
        $stmt = $conn->prepare("SELECT image_path FROM news_updates WHERE id = ?");
        $stmt->execute([$data->id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $url_path = parse_url($row['image_path'], PHP_URL_PATH);
            $relative_path = str_replace("/{$PROJECT_FOLDER}/", "", $url_path);
            $file_to_delete = "../" . ltrim($relative_path, '/');
            if (file_exists($file_to_delete)) unlink($file_to_delete);
            
            $del = $conn->prepare("DELETE FROM news_updates WHERE id = ?");
            $del->execute([$data->id]);
            echo json_encode(["message" => "Deleted"]);
        }
    }
}
?>