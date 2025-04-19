<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

function emailVenta($datos)
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

        $productos = $datos["productos"];
        $nombre = $datos["nombre"];
        $correo = $datos["correo"];
        $telefono = $datos["telefono"];
        $collection_id = $datos["collection_id"];
        $collection_status = $datos["collection_status"];
        $payment_id = $datos["payment_id"];
        $status = $datos["status"];
        $payment_type = $datos["payment_type"];
        $preference_id = $datos["preference_id"];
        $merchant_order_id = $datos["merchant_order_id"];

        if (filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($correo, $nombre);
        }

        $mail->setFrom('', '');
        $mail->addAddress('', '');

        $body = "Nombre: $nombre<br>Teléfono: $telefono<br>Correo: $correo<br><br>Datos de la venta<br>collection_id: $collection_id<br>collection_status: $collection_status<br>payment_id: $payment_id<br>status: $status<br>payment_type: $payment_type<br> preference_id: $preference_id<br>merchant_order_id: $merchant_order_id";
        $body .= "<br><br>Productos:<br><br>";
        foreach ($productos as $element) {
            switch ($element["medida"]) {
                case "200":
                    $precio = 265;
                    break;
                case "250":
                    $precio = 295;
                    break;
                case "700":
                    $precio = 570;
                    break;
                default:
                echo json_encode(false);
            }
            $body .= "ID producto: " . $element["id"] . "<br>Cantidad: " . $element["cantidad"] . "<br>Medida: " . $element["medida"] . "<br>Precio Total: " . $element["cantidad"] * $precio . "<br><br>";
        }
        $mail->isHTML(true);
        $mail->Subject = 'Nueva compra desde la pagina';
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}
