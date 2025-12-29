<?php
// --- ENHANCED CORS HEADERS FOR ALL METHODS ---
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache for 1 day
}

// Handle preflight OPTIONS request specifically
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

// 1. GET IMAGES
if ($method == 'GET') {
    $program_id = isset($_GET['program_id']) ? $_GET['program_id'] : '';
    if($program_id) {
        $query = "SELECT * FROM program_gallery WHERE program_id = ? ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute([$program_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode([]);
    }
}

// 2. UPLOAD IMAGE
if ($method == 'POST') {
    if (isset($_FILES['image']) && isset($_POST['program_id'])) {
        $program_id = $_POST['program_id'];
        $target_dir = "../uploads/"; // Relative to this api/ file
        
        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);

        $file_ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
        $filename = uniqid() . "." . $file_ext;
        $target_file = $target_dir . $filename;
        
        // IMPORTANT: Update this to match your actual project folder name
        $PROJECT_FOLDER_NAME = "sridivyangsevakendram.org";
        $image_url = "http://localhost/{$PROJECT_FOLDER_NAME}/uploads/" . $filename;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $query = "INSERT INTO program_gallery (program_id, image_path) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            if($stmt->execute([$program_id, $image_url])) {
                echo json_encode(["message" => "Image uploaded successfully", "url" => $image_url, "id" => $conn->lastInsertId()]);
            } else {
                http_response_code(500); echo json_encode(["message" => "Database error"]);
            }
        } else {
            http_response_code(500); echo json_encode(["message" => "Failed to upload file"]);
        }
    } else {
        http_response_code(400); echo json_encode(["message" => "No file selected"]);
    }
}

// 3. DELETE IMAGE (With File Deletion)
if ($method == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->id)) {
        // First, find the image path in the database
        $stmt_select = $conn->prepare("SELECT image_path FROM program_gallery WHERE id = ?");
        $stmt_select->execute([$data->id]);
        $row = $stmt_select->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Logic to find the physical file path from the URL
            $image_url = $row['image_path'];
            $url_path = parse_url($image_url, PHP_URL_PATH);
            // IMPORTANT: This must match the folder name you set in the POST section
            $PROJECT_FOLDER_NAME = "sridivyangsevakendram.org"; 
            // Removes "/sridivyangsevakendram.org/" to get "uploads/filename.jpg"
            $relative_path = str_replace("/{$PROJECT_FOLDER_NAME}/", "", $url_path);
            $file_to_delete = "../" . ltrim($relative_path, '/');

            // Delete physical file if it exists
            if (file_exists($file_to_delete) && is_file($file_to_delete)) {
                unlink($file_to_delete);
            }

            // Now delete record from database
            $stmt_delete = $conn->prepare("DELETE FROM program_gallery WHERE id = ?");
            if($stmt_delete->execute([$data->id])) {
                echo json_encode(["message" => "Image and record deleted successfully"]);
            } else {
                http_response_code(500); echo json_encode(["message" => "Failed to delete from database"]);
            }
        } else {
            http_response_code(404); echo json_encode(["message" => "Image not found"]);
        }
    } else {
        http_response_code(400); echo json_encode(["message" => "Invalid request"]);
    }
}
?>