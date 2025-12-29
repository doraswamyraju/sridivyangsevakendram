<?php
// api/volunteer.php
include_once 'database.php';
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->fullName) && !empty($data->email)) {
    $query = "INSERT INTO volunteers SET full_name=:name, email=:email, phone=:phone, interest=:interest, message=:msg";
    $stmt = $conn->prepare($query);
    
    $stmt->bindParam(":name", $data->fullName);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":interest", $data->interest);
    $stmt->bindParam(":msg", $data->message);

    if($stmt->execute()) {
        echo json_encode(["message" => "Application submitted"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Submission failed"]);
    }
}
?>