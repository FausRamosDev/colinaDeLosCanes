<?php

// var_dump($_REQUEST);

// var_dump($_POST);
// var_dump($_FILES);

require_once "../models/contacto.php";
require_once "../models/gestionarProductos.php";
require_once "../models/ingreso.php";
require_once "../models/reservaProductos.php";
require_once "../models/mercadoPago.php";
require_once "../models/venta.php";
require_once "../models/reviews.php";

$datos = isset($_REQUEST["datos"]) ? $_REQUEST["datos"] : null;
$funcionalidad = $_REQUEST["funcionalidad"];

switch ($funcionalidad) {
    case "contacto":
        contacto();
        break;
    case "gestionarProductos":
        gestionarProductos($datos);
        break;
    case "ingreso":
        ingreso($datos);
        break;
    case "reservarProductos":
        reservarProductosController();
        break;
    case "comprarProductos":
        comprarProductos();
        break;
    case "guardarVenta":
        guardarVenta($datos);
        break;
    case "gestionarReviews":
        gestionarReviews();
        break;
    default:
        echo json_encode(false);
        break;
}

function contacto()
{
    class ContactContacto
    {
        public function sendEmail()
        {
            header('Content-Type: application/json');

            if (
                isset($_POST["nombre"]) &&
                isset($_POST["correo"]) &&
                isset($_POST["mensaje"])
            ) {
                $nombre = htmlspecialchars(trim($_POST["nombre"]));
                $correo = filter_var(trim($_POST["correo"]), FILTER_VALIDATE_EMAIL);
                $mensaje = htmlspecialchars(trim($_POST["mensaje"]));

                if (!$nombre || !$correo || !$mensaje) {
                    echo json_encode(["error" => "Por favor, complete todos los campos correctamente."]);
                    return;
                }

                $result = emailModel($nombre, $correo, $mensaje);

                echo json_encode($result);
            } else {
                echo json_encode(["error" => "Faltan datos en el formulario."]);
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $controller = new ContactContacto();
        $controller->sendEmail();
    }
}

function reservarProductosController() {
    class ContactReserva
    {
        public function reservarEmail()
        {
            header('Content-Type: application/json');

            if (
                isset($_POST["nombre"]) &&
                isset($_POST["telefono"]) &&
                isset($_POST["productos"])
            ) {
                $nombre = htmlspecialchars(trim($_POST["nombre"]));
                $telefono = htmlspecialchars(trim($_POST["telefono"]));
                $mensaje = htmlspecialchars(trim($_POST["mensaje"]));
                $productos = $_POST["productos"];

                if (!$nombre || !$telefono || !$productos) {
                    echo json_encode(["error" => "Por favor, complete todos los campos correctamente."]);
                    return;
                }

                $result = reservarProductosModel($nombre, $telefono, $mensaje, $productos);

                // if ($result === true) {
                //     echo json_encode(true);
                // } else {
                //     echo json_encode(false);
                // }

                echo json_encode($result);
            } else {
                echo json_encode(["error" => "Faltan datos en el formulario."]);
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $controller = new ContactReserva();
        $controller->reservarEmail();
    }
}

function gestionarProductos($datos)
{
    $ruta = "../../assets/images/productos/";

    switch ($_SERVER["REQUEST_METHOD"]) {
        case "POST":
            altaModificarProducto($ruta);
            break;
        case "GET":
            listarProducto();
            break;
        case "DELETE":
            bajaProducto();
            break;
        default:
            echo json_encode(false);
            break;
    }
}

function ingreso($datos)
{
    $usuario = isset($_REQUEST["datos"]["usuario"]) ? $_REQUEST["datos"]["usuario"] : null;
    $contrasenia = isset($_REQUEST["datos"]["contrasenia"]) ? $_REQUEST["datos"]["contrasenia"] : null;
    if ($usuario && $contrasenia) {

        $sql = "SELECT * FROM administrador WHERE usuario = ? AND contrasenia = ?";
        $params = "ss";
        $atributos = [$usuario, $contrasenia];

        echo json_encode(ingresarAlSistema($sql, $params, $atributos));
    }
}

function comprarProductos () {
    $id = $_POST["id"];
    $title = $_POST["title"];
    $quantity = (int)$_POST["quantity"];
    $unitPrice = (float)$_POST["unit_price"];

    echo json_encode(mercadoPago($id, $title, $quantity, $unitPrice));
}

function guardarVenta ($datos) {
    class ContactVenta
    {
        public function sendEmail($datos)
        {
            header('Content-Type: application/json');
            if (
                isset($datos["productos"]) &&
                isset($datos["nombre"]) &&
                isset($datos["telefono"]) &&
                isset($datos["correo"]) &&
                isset($datos["collection_id"]) &&
                isset($datos["collection_status"]) &&
                isset($datos["payment_id"]) &&
                isset($datos["status"]) &&
                isset($datos["payment_type"]) &&
                isset($datos["preference_id"]) &&
                isset($datos["merchant_order_id"])
            ) {
                $result = emailVenta($datos);
                echo json_encode($result);
            } else {
                echo json_encode(false);
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $controller = new ContactVenta();
        $controller->sendEmail($datos);
    }
}

function gestionarReviews() {
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "POST":
            altaReview();
            break;
        case "GET":
            listarReview();
            break;
        case "DELETE":
            bajaReview();
            break;
        default:
            echo json_encode(false);
            break;
    }
}


?>