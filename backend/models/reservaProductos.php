<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

function reservarProductosModel($nombre, $telefono, $mensaje, $productos)
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
        // $mail->addReplyTo($telefono, $nombre);

        $body = "Nombre: $nombre<br>Teléfono: $telefono<br>Mensaje: $mensaje<br>";

        function precios($medida)
        {
            switch ($medida) {
                case 200:
                    return 100;
                case 250:
                    return 150;
                case 700:
                    return 400;
                default:
                    return 0;
            }
        }

        $precioTotal = 0;
        $contador = 0;

        foreach ($productos as $element) {
            $body .= "ID producto: " . $element["id"] . ", medida: " . $element["medida"] . ", cantidad: " . $element["cantidad"] . ", precio producto: " . (precios($element["medida"]) * $element["cantidad"]) . "<br>";
            $contador++;
            $precioTotal += (precios($element["medida"]) * $element["cantidad"]);
        }

        $body .= "<br>Cantidad de productos: $contador";
        $body .= "<br>Precio Total: $$precioTotal";

        $mail->isHTML(true);
        $mail->Subject = 'Nueva reserva de productos desdde la pagina';
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}
?>