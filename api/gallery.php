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

// 1. GET IMAGES (WITH SMART URL FIX)
if ($method == 'GET') {
    $program_id = isset($_GET['program_id']) ? $_GET['program_id'] : '';
    if($program_id) {
        $query = "SELECT * FROM program_gallery WHERE program_id = ? ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute([$program_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // AUTO-CORRECT URLs
        foreach ($results as &$row) {
            if (!empty($row['image_path'])) {
                $row['image_path'] = str_replace(
                    ['http://localhost/sridivyangsevakendram.org', 'http://localhost'], 
                    'https://sridivyangsevakendram.org', 
                    $row['image_path']
                );
            }
        }
        echo json_encode($results);
    } else {
        echo json_encode([]);
    }
}

// 2. UPLOAD IMAGE (MULTIPLE SUPPORT)
if ($method == 'POST') {
    // Check if files are uploaded
    if (isset($_FILES['image']) && isset($_POST['program_id'])) {
        $program_id = $_POST['program_id'];
        $title = isset($_POST['title']) ? $_POST['title'] : '';
        $target_dir = "../uploads/"; 
        
        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);

        // Standardize file array structure
        $files = [];
        if (is_array($_FILES['image']['name'])) {
            $count = count($_FILES['image']['name']);
            for ($i = 0; $i < $count; $i++) {
                $files[] = [
                    'name' => $_FILES['image']['name'][$i],
                    'tmp_name' => $_FILES['image']['tmp_name'][$i],
                    'error' => $_FILES['image']['error'][$i]
                ];
            }
        } else {
            $files[] = $_FILES['image'];
        }

        $uploaded_images = [];
        $group_id = uniqid('g_'); // Create a unique group ID for this batch

        // Dynamic URL Generation
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
        $host = $_SERVER['HTTP_HOST'];
        $path_prefix = ($host === 'localhost') ? "/sridivyangsevakendram.org" : "";

        foreach ($files as $file) {
            if ($file['error'] !== UPLOAD_ERR_OK) continue;

            $file_ext = pathinfo($file["name"], PATHINFO_EXTENSION);
            $filename = uniqid() . "." . $file_ext;
            $target_file = $target_dir . $filename;
            
            $image_url = $protocol . "://" . $host . $path_prefix . "/uploads/" . $filename;

            if (move_uploaded_file($file["tmp_name"], $target_file)) {
                $query = "INSERT INTO program_gallery (program_id, image_path, title, group_id) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($query);
                if($stmt->execute([$program_id, $image_url, $title, $group_id])) {
                    $uploaded_images[] = ["id" => $conn->lastInsertId(), "url" => $image_url];
                }
            }
        }

        if (count($uploaded_images) > 0) {
            echo json_encode(["message" => "Images uploaded", "uploaded" => $uploaded_images]);
        } else {
            http_response_code(500); echo json_encode(["message" => "Failed to upload files"]);
        }

    } else {
        http_response_code(400); echo json_encode(["message" => "No file selected"]);
    }
}

// 3. DELETE IMAGE
if ($method == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    // Support deleting single image by ID or entire group by group_id (optional, for now just simple delete)
    if(isset($data->id)) {
        $stmt_select = $conn->prepare("SELECT image_path FROM program_gallery WHERE id = ?");
        $stmt_select->execute([$data->id]);
        $row = $stmt_select->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $image_url = $row['image_path'];
            $url_path = parse_url($image_url, PHP_URL_PATH);
            $PROJECT_FOLDER_NAME = "sridivyangsevakendram.org"; 
            $relative_path = str_replace("/{$PROJECT_FOLDER_NAME}/", "", $url_path);
            $file_to_delete = "../" . ltrim($relative_path, '/');

            if (file_exists($file_to_delete) && is_file($file_to_delete)) {
                unlink($file_to_delete);
            }

            $stmt_delete = $conn->prepare("DELETE FROM program_gallery WHERE id = ?");
            if($stmt_delete->execute([$data->id])) {
                echo json_encode(["message" => "Deleted"]);
            } else {
                http_response_code(500); echo json_encode(["message" => "Failed to delete from database"]);
            }
        } else {
            http_response_code(404); echo json_encode(["message" => "Image not found"]);
        }
    }
}
?>