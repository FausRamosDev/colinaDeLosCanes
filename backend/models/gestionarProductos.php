<?php

require_once("../config/database.php");

function altaModificarProducto($ruta)
{
    function guardarImagen($ruta)
    {
        if (isset($_FILES["file"]) && isset($_FILES["file"]["name"][0])) {
            if (file_exists($ruta)) {
                $origenArchivo = $_FILES["file"]["tmp_name"];
                $destinoArchivo = $ruta . $_FILES["file"]["name"];
                if (@move_uploaded_file($origenArchivo, $destinoArchivo)) {
                    return $_FILES["file"]["name"];
                } else {
                    return "La imagen no se pudo guardar.";
                }
            } else {
                return "Ruta de imágenes no encontrada.";
            }
        }
        return null;
    }

    global $conexion;

    $idProducto = isset($_REQUEST["idProducto"]) ? $_REQUEST["idProducto"] : null;
    $nombreProducto = isset($_REQUEST["titulo"]) ? $_REQUEST["titulo"] : null;
    $descripcionProducto = isset($_REQUEST["description"]) ? $_REQUEST["description"] : null;
    $imagenProducto = guardarImagen($ruta);
    
    if ($idProducto) {
        $sql = "UPDATE productos SET ";
        $params = "";
        $atributos = [];

        if ($nombreProducto) {
            $sql .= "titulo = ?, ";
            $params .= "s";
            $atributos[] = $nombreProducto;
        }

        if ($descripcionProducto) {
            $sql .= "descripcion = ?, ";
            $params .= "s";
            $atributos[] = $descripcionProducto;
        }

        if ($imagenProducto) {
            $sql .= "imagen = ?, ";
            $params .= "s";
            $atributos[] = $imagenProducto;
        }

        $sql = rtrim($sql, ", ") . " WHERE id = ?";
        $params .= "i";
        $atributos[] = $idProducto;

        try {
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param($params, ...$atributos);
            $stmt->execute();
            
            echo json_encode($stmt->affected_rows > 0);

            $stmt->close();
        } catch (Exception $e) {
            die($e->getMessage());
        }
    } else {
        if ($nombreProducto && $descripcionProducto && $imagenProducto) {
            $sql = "INSERT INTO productos (imagen, titulo, descripcion) VALUES (?, ?, ?)";
            $params = "sss";
            $atributos = [$imagenProducto, $nombreProducto, $descripcionProducto];

            try {
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param($params, ...$atributos);
                $stmt->execute();
                $stmt->close();

                $sqlConsulta = "SELECT * FROM productos WHERE id = ?";
                $paramsConsulta = "i";
                $atributosConsulta = $conexion->insert_id;

                echo json_encode(verificarExistencia($sqlConsulta, $paramsConsulta, $atributosConsulta));                
            } catch (Exception $e) {
                die($e->getMessage());
            }
        } else {
            echo json_encode("El título, descripción e imagen son obligatorios para crear un producto.");
        }
    }
}


function bajaProducto()
{
    global $conexion;

    try {
        $id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : null;
        $sqlConsulta = "SELECT * FROM productos WHERE id = ?";
        $paramsConsulta = "i";
        $atributosConsulta = $id;

        if ($id) {
            $sql = "DELETE FROM productos WHERE id = ?";
            $params = "i";
            $atributos = $id;

            $stmt = $conexion->prepare($sql);
            $stmt->bind_param($params, $atributos);
            $stmt->execute();
            $stmt->close();

            echo json_encode(!verificarExistencia($sqlConsulta, $paramsConsulta, $atributosConsulta));

        } else {
            echo json_encode(false);
        }
    } catch (Exception $e) {
        die($e->getMessage());
    }
}
function listarProducto()
{
    global $conexion;

    try {
        $id = isset($_REQUEST["datos"]["id"]) ? $_REQUEST["datos"]["id"] : null;

        if ($id) {

            $contador = 0;

            foreach ($id as $elemento) {
                $contador++;
            }

            if ($contador == 1) {
                $sql = "SELECT * FROM productos WHERE id = ?";
                $params = "i";
                $atributos = [];

                foreach ($id as $elemento) {
                    array_push($atributos, $elemento);
                }

                $stmt = $conexion->prepare($sql);

                if (is_array($atributos)) {
                    if (count($atributos) > 1) {
                        $stmt->bind_param($params, ...$atributos);
                    } else {
                        $stmt->bind_param($params, $atributos[0]);
                    }
                } else {
                    $stmt->bind_param($params, $atributos);
                }

                $stmt->execute();
                $result = $stmt->get_result();

                $resultado = array();

                while ($row = $result->fetch_assoc()) {
                    $resultado[] = $row;
                }

                $stmt->close();
            } else {
                $resultado = array();

                foreach ($id as $productoId) {
                    $sql = "SELECT * FROM productos WHERE id = ?";
                    $params = "i";
                    $atributos = [];

                    array_push($atributos, $productoId);

                    $stmt = $conexion->prepare($sql);

                    if (is_array($atributos)) {
                        if (count($atributos) > 1) {
                            $stmt->bind_param($params, ...$atributos);
                        } else {
                            $stmt->bind_param($params, $atributos[0]);
                        }
                    } else {
                        $stmt->bind_param($params, $atributos);
                    }

                    $stmt->execute();
                    $result = $stmt->get_result();

                    while ($row = $result->fetch_assoc()) {
                        array_push($resultado, $row);
                    }

                    $stmt->close();
                }
            }


        } else {
            $sql = "SELECT * FROM productos";

            $stmt = $conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $resultado = array();

            while ($row = $result->fetch_assoc()) {
                $resultado[] = $row;
            }

            $stmt->close();
        }

        echo json_encode($resultado);
    } catch (Exception $e) {
        die($e->getMessage());
    }

}

function verificarExistencia($sql, $params, $atributos)
{
    global $conexion;

    $stmt = $conexion->prepare($sql);

    if (is_array($atributos)) {
        if (count($atributos) > 1) {
            $stmt->bind_param($params, ...$atributos);
        } else {
            $stmt->bind_param($params, $atributos[0]);
        }
    } else {
        $stmt->bind_param($params, $atributos);
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    return $resultado->num_rows > 0;
}
?>