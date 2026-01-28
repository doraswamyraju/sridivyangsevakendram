<?php
include_once 'database.php';

try {
    // Check if columns exist, if not add them
    $columns = $conn->query("SHOW COLUMNS FROM program_gallery")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('title', $columns)) {
        $conn->exec("ALTER TABLE program_gallery ADD COLUMN title VARCHAR(255) NULL AFTER program_id");
        echo "Added 'title' column.\n";
    }

    if (!in_array('group_id', $columns)) {
        $conn->exec("ALTER TABLE program_gallery ADD COLUMN group_id VARCHAR(64) NULL AFTER title");
        echo "Added 'group_id' column.\n";
    }
    
    // Add display_date just in case we want to show date of event later, defaulting to created_at logic
    if (!in_array('event_date', $columns)) {
         $conn->exec("ALTER TABLE program_gallery ADD COLUMN event_date DATE NULL AFTER group_id");
         echo "Added 'event_date' column.\n";
    }

    echo "Database schema check/update complete.\n";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
