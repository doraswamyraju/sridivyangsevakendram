<?php
// CORS Headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");
include_once 'database.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to remove physical file safely
function delete_physical_file($image_url) {
    if (empty($image_url)) return;
    $url_path = parse_url($image_url, PHP_URL_PATH);
    $filename = basename($url_path);
    $local_path = __DIR__ . '/../uploads/' . $filename;
    if (file_exists($local_path) && is_file($local_path)) {
        @unlink($local_path);
    }
}

// 1. GET ALBUMS OR ALBUM DETAILS
if ($method === 'GET') {
    // If specific album requested
    if (isset($_GET['album_id'])) {
        $album_id = intval($_GET['album_id']);
        $stmt = $conn->prepare("SELECT * FROM gallery_albums WHERE id = ?");
        $stmt->execute([$album_id]);
        $album = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($album) {
            $img_stmt = $conn->prepare("SELECT id, image_path, is_featured, created_at FROM gallery_images WHERE album_id = ? ORDER BY is_featured DESC, id DESC");
            $img_stmt->execute([$album_id]);
            $album['images'] = $img_stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($album);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Album not found"]);
        }
        exit();
    }

    $program_id = isset($_GET['program_id']) ? $_GET['program_id'] : '';
    if (empty($program_id)) {
        http_response_code(400);
        echo json_encode(["message" => "program_id is required"]);
        exit();
    }

    // Clean MySQL 8 query without GROUP BY issues
    $query = "SELECT id, program_id, title, description, event_date, venue, featured_image_id, created_at 
              FROM gallery_albums 
              WHERE program_id = ? 
              ORDER BY COALESCE(event_date, created_at) DESC, id DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([$program_id]);
    $albums = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch images and cover for each album
    foreach ($albums as &$alb) {
        $img_stmt = $conn->prepare("SELECT id, image_path, is_featured, created_at FROM gallery_images WHERE album_id = ? ORDER BY is_featured DESC, id DESC");
        $img_stmt->execute([$alb['id']]);
        $images = $img_stmt->fetchAll(PDO::FETCH_ASSOC);

        $alb['images'] = $images;
        $alb['photo_count'] = count($images);

        // Find cover: either featured or first image
        $cover = null;
        foreach ($images as $img) {
            if ($img['is_featured'] == 1) {
                $cover = $img['image_path'];
                break;
            }
        }
        if (!$cover && count($images) > 0) {
            $cover = $images[0]['image_path'];
        }

        $alb['cover'] = $cover;
        $alb['image_path'] = $cover;
        $alb['group_id'] = (string)$alb['id'];
    }

    echo json_encode($albums);
    exit();
}

// 2. CREATE NEW ALBUM & UPLOAD PHOTOS
if ($method === 'POST') {
    $program_id = isset($_POST['program_id']) ? trim($_POST['program_id']) : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $event_date = !empty($_POST['event_date']) ? $_POST['event_date'] : null;
    $venue = !empty($_POST['venue']) ? trim($_POST['venue']) : null;
    $featured_index = isset($_POST['featured_index']) ? intval($_POST['featured_index']) : 0;

    if (empty($program_id) || empty($title)) {
        http_response_code(400);
        echo json_encode(["message" => "Program ID and Event Title are required."]);
        exit();
    }

    $files_key = isset($_FILES['images']) ? 'images' : (isset($_FILES['image']) ? 'image' : null);

    if (!$files_key || empty($_FILES[$files_key]['name'])) {
        http_response_code(400);
        echo json_encode(["message" => "Please select at least one photo."]);
        exit();
    }

    $raw_files = $_FILES[$files_key];
    $files = [];
    if (is_array($raw_files['name'])) {
        $count = count($raw_files['name']);
        for ($i = 0; $i < $count; $i++) {
            $files[] = [
                'name' => $raw_files['name'][$i],
                'tmp_name' => $raw_files['tmp_name'][$i],
                'error' => $raw_files['error'][$i]
            ];
        }
    } else {
        $files[] = [
            'name' => $raw_files['name'],
            'tmp_name' => $raw_files['tmp_name'],
            'error' => $raw_files['error']
        ];
    }

    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("INSERT INTO gallery_albums (program_id, title, description, event_date, venue) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$program_id, $title, $description, $event_date, $venue]);
        $album_id = $conn->lastInsertId();

        $target_dir = __DIR__ . "/../uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $uploaded_images = [];
        $featured_image_id = null;

        for ($i = 0; $i < count($files); $i++) {
            if ($files[$i]['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($files[$i]['name'], PATHINFO_EXTENSION));
                $new_filename = uniqid('ssk_') . '.' . $ext;
                $target_file = $target_dir . $new_filename;

                if (move_uploaded_file($files[$i]['tmp_name'], $target_file)) {
                    $image_url = "/uploads/" . $new_filename;
                    $is_featured = ($i === $featured_index) ? 1 : 0;

                    $img_stmt = $conn->prepare("INSERT INTO gallery_images (album_id, image_path, is_featured) VALUES (?, ?, ?)");
                    $img_stmt->execute([$album_id, $image_url, $is_featured]);
                    $inserted_img_id = $conn->lastInsertId();

                    if ($is_featured === 1) {
                        $featured_image_id = $inserted_img_id;
                    }

                    $uploaded_images[] = [
                        "id" => $inserted_img_id,
                        "image_path" => $image_url,
                        "is_featured" => $is_featured
                    ];
                }
            }
        }

        if (!$featured_image_id && count($uploaded_images) > 0) {
            $featured_image_id = $uploaded_images[0]['id'];
            $conn->prepare("UPDATE gallery_images SET is_featured = 1 WHERE id = ?")->execute([$featured_image_id]);
        }

        if ($featured_image_id) {
            $conn->prepare("UPDATE gallery_albums SET featured_image_id = ? WHERE id = ?")->execute([$featured_image_id, $album_id]);
        }

        $conn->commit();
        echo json_encode(["status" => "success", "album_id" => $album_id, "uploaded" => count($uploaded_images)]);
    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Failed to create album: " . $e->getMessage()]);
    }
    exit();
}

// 3. UPDATE ALBUM / SET FEATURED IMAGE
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->action) && $data->action === 'set_featured' && isset($data->album_id) && isset($data->image_id)) {
        $conn->prepare("UPDATE gallery_images SET is_featured = 0 WHERE album_id = ?")->execute([$data->album_id]);
        $conn->prepare("UPDATE gallery_images SET is_featured = 1 WHERE id = ? AND album_id = ?")->execute([$data->image_id, $data->album_id]);
        $conn->prepare("UPDATE gallery_albums SET featured_image_id = ? WHERE id = ?")->execute([$data->image_id, $data->album_id]);
        echo json_encode(["status" => "success", "message" => "Featured image updated"]);
        exit();
    }

    http_response_code(400);
    echo json_encode(["message" => "Invalid update action"]);
    exit();
}

// 4. DELETE ALBUM OR SINGLE IMAGE
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));

    $album_id = isset($data->album_id) ? intval($data->album_id) : (isset($data->id) && !isset($data->image_id) ? intval($data->id) : null);

    // Delete Entire Album
    if ($album_id) {
        $stmt = $conn->prepare("SELECT image_path FROM gallery_images WHERE album_id = ?");
        $stmt->execute([$album_id]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($images as $img) {
            delete_physical_file($img['image_path']);
        }

        $del_stmt = $conn->prepare("DELETE FROM gallery_albums WHERE id = ?");
        $del_stmt->execute([$album_id]);

        echo json_encode(["status" => "success", "message" => "Album and photos deleted successfully"]);
        exit();
    }

    // Delete Single Photo
    if (isset($data->image_id)) {
        $image_id = intval($data->image_id);
        $stmt = $conn->prepare("SELECT album_id, image_path, is_featured FROM gallery_images WHERE id = ?");
        $stmt->execute([$image_id]);
        $img = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($img) {
            delete_physical_file($img['image_path']);
            $conn->prepare("DELETE FROM gallery_images WHERE id = ?")->execute([$image_id]);

            if ($img['is_featured'] == 1) {
                $next_stmt = $conn->prepare("SELECT id FROM gallery_images WHERE album_id = ? LIMIT 1");
                $next_stmt->execute([$img['album_id']]);
                $next = $next_stmt->fetch(PDO::FETCH_ASSOC);
                if ($next) {
                    $conn->prepare("UPDATE gallery_images SET is_featured = 1 WHERE id = ?")->execute([$next['id']]);
                    $conn->prepare("UPDATE gallery_albums SET featured_image_id = ? WHERE id = ?")->execute([$next['id'], $img['album_id']]);
                } else {
                    $conn->prepare("UPDATE gallery_albums SET featured_image_id = NULL WHERE id = ?")->execute([$img['album_id']]);
                }
            }

            echo json_encode(["status" => "success", "message" => "Image deleted"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Image not found"]);
        }
        exit();
    }

    http_response_code(400);
    echo json_encode(["message" => "Missing album_id or image_id"]);
    exit();
}
?>
