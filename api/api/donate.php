<?php
// api/donate.php
include_once 'database.php';

// Load Libraries (Ensure you extracted them correctly!)
require('libs/fpdf/fpdf.php');
require('libs/PHPMailer/Exception.php');
require('libs/PHPMailer/PHPMailer.php');
require('libs/PHPMailer/SMTP.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->firstName) && !empty($data->amount) && !empty($data->transaction_id)) {
    try {
        // 1. SAVE TO DATABASE
        $query = "INSERT INTO donations SET 
                    full_name=:name, email=:email, phone=:phone, 
                    amount=:amount, transaction_id=:txn, 
                    pan_number=:pan, address=:addr, payment_status='success'";
        
        $stmt = $conn->prepare($query);
        
        $fullName = htmlspecialchars($data->firstName . ' ' . $data->lastName);
        $stmt->bindParam(":name", $fullName);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":phone", $data->phone);
        $stmt->bindParam(":amount", $data->amount);
        $stmt->bindParam(":txn", $data->transaction_id);
        $stmt->bindParam(":pan", $data->pan);
        $stmt->bindParam(":addr", $data->address);

        if($stmt->execute()) {
            
            // 2. GENERATE 80G RECEIPT (PDF)
            $receiptNo = "SSK-" . time();
            $pdf = new FPDF();
            $pdf->AddPage();
            
            // Header
            $pdf->SetFont('Arial', 'B', 16);
            $pdf->Cell(0, 10, 'SRI DIVYANG SEVA KENDRAM TRUST', 0, 1, 'C');
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(0, 5, 'Regd No: 5/2023 | 80G No: ABGTS0850H', 0, 1, 'C');
            $pdf->Cell(0, 5, 'Tirupati, Andhra Pradesh, India', 0, 1, 'C');
            $pdf->Line(10, 30, 200, 30);
            
            // Receipt Details
            $pdf->Ln(10);
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(0, 10, 'DONATION RECEIPT', 0, 1, 'C');
            
            $pdf->SetFont('Arial', '', 11);
            $pdf->Ln(5);
            $pdf->Cell(50, 10, 'Receipt No:', 0, 0); $pdf->Cell(50, 10, $receiptNo, 0, 1);
            $pdf->Cell(50, 10, 'Date:', 0, 0); $pdf->Cell(50, 10, date("d-m-Y"), 0, 1);
            $pdf->Cell(50, 10, 'Donor Name:', 0, 0); $pdf->Cell(50, 10, $fullName, 0, 1);
            $pdf->Cell(50, 10, 'Donor PAN:', 0, 0); $pdf->Cell(50, 10, $data->pan, 0, 1);
            $pdf->Cell(50, 10, 'Amount:', 0, 0); $pdf->Cell(50, 10, 'Rs. ' . $data->amount . '/-', 0, 1);
            $pdf->Cell(50, 10, 'Transaction ID:', 0, 0); $pdf->Cell(50, 10, $data->transaction_id, 0, 1);
            
            $pdf->Ln(10);
            $pdf->MultiCell(0, 5, 'Thank you for your generous contribution. This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961.');
            
            $pdf->Ln(20);
            $pdf->Cell(0, 10, 'Authorized Signatory', 0, 1, 'R');

            // Save PDF to Server temporarily
            $filename = "receipts/" . $receiptNo . ".pdf";
            if (!is_dir('receipts')) mkdir('receipts', 0777, true);
            $pdf->Output('F', $filename);

            // 3. SEND EMAIL WITH ATTACHMENT
            $mail = new PHPMailer(true);
            try {
                // SMTP Configuration (REPLACE WITH YOUR EMAIL DETAILS)
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com'; // or your hosting mail server
                $mail->SMTPAuth   = true;
                $mail->Username   = 'rajugariventures@gmail.com'; 
                $mail->Password   = 'znejpufbvcwqcast'; 
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port       = 465;

                // Recipients
                $mail->setFrom('contact@sridivyangsevakendram.org', 'SSK Trust');
                $mail->addAddress($data->email, $fullName);

                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Donation Receipt - SSK Trust';
                $mail->Body    = "Dear $fullName,<br><br>Thank you for your donation of Rs. $data->amount. Please find your 80G tax receipt attached.<br><br>Regards,<br>SSK Trust";
                
                // Attachment
                $mail->addAttachment($filename);

                $mail->send();
                echo json_encode(["status" => "success", "message" => "Donation recorded & Receipt sent"]);
            } catch (Exception $e) {
                echo json_encode(["status" => "success", "message" => "Recorded but Email Failed: " . $mail->ErrorInfo]);
            }
        }
    } catch (Exception $e) {
        http_response_code(503);
        echo json_encode(["message" => "Error: " . $e->getMessage()]);
    }
}
?>