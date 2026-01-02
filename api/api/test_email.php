<?php
// api/test_email.php

// Load Libraries
require('libs/PHPMailer/Exception.php');
require('libs/PHPMailer/PHPMailer.php');
require('libs/PHPMailer/SMTP.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'rajugariventures@gmail.com'; // <--- Put your Gmail here
    $mail->Password   = 'znejpufbvcwqcast';            // <--- Put your 16-char App Password here
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('contact@ssktrust.org', 'SSK Admin Test');
    $mail->addAddress('doraswamyraju.ca@gmail.com'); // Send to yourself to test

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from SSK Trust';
    $mail->Body    = '<b>Success!</b> Your SMTP email configuration is working perfectly.';

    $mail->send();
    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>