<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

function emailModel($nombre, $correo, $mensaje)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = '';
        $mail->Password = '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('', '');
        $mail->addAddress('', '');
        $mail->addReplyTo($correo, $nombre);

        $body = "Nombre: $nombre<br>Correo: $correo<br>Mensaje: $mensaje";
        $mail->isHTML(true);
        $mail->Subject = 'Nuevo mensaje desde la pagina';
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}
?>