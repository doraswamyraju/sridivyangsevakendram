<?php
include_once 'database.php';

// Fetch latest Donations
$stmt = $conn->prepare("SELECT * FROM donations ORDER BY created_at DESC");
$stmt->execute();
$donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch latest Volunteers
$stmt = $conn->prepare("SELECT * FROM volunteers ORDER BY created_at DESC");
$stmt->execute();
$volunteers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return both
echo json_encode([
    "donations" => $donations,
    "volunteers" => $volunteers
]);
?>