<?php

require_once("../config/database.php");

function altaReview () {
    global $conexion;

    $nombre = isset($_REQUEST["nombre"]) ? $_REQUEST["nombre"] : null;
    $descripcion = isset($_REQUEST["descripcion"]) ? $_REQUEST["descripcion"] : null;
    $estrellas = isset($_REQUEST["estrellas"]) ? $_REQUEST["estrellas"] : null;

    if ($nombre && $descripcion && $estrellas) {
        $sql = "INSERT INTO reviews (nombre, descripcion, estrellas) VALUES (?, ?, ?)";
        $params = "ssi";
        $atributos = [$nombre, $descripcion, $estrellas];

        try {
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param($params, ...$atributos);
            $stmt->execute();
            $stmt->close();

            $sqlConsulta = "SELECT * FROM reviews WHERE nombre = ?";
            $paramsConsulta = "s";
            $atributosConsulta = $nombre;

            echo json_encode(verificarExistencia($sqlConsulta, $paramsConsulta, $atributosConsulta));                
        } catch (Exception $e) {
            die($e->getMessage());
        }
    } else {
        echo json_encode("El nombre, descripción y estrellas son obligatorios para crear una review.");
    }
}

function listarReview () {
    global $conexion;

    $sql = "SELECT * FROM reviews";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $resultado = array();

    while ($row = $result->fetch_assoc()) {
        $resultado[] = $row;
    }

    $stmt->close();

    echo json_encode($resultado);
}

function bajaReview () {
    global $conexion;

    try {
        $nombre = isset($_REQUEST["nombre"]) ? $_REQUEST["nombre"] : null;
        $sqlConsulta = "SELECT * FROM reviews WHERE nombre = ?";
        $paramsConsulta = "s";
        $atributosConsulta = $nombre;

        if ($nombre) {
            $sql = "DELETE FROM reviews WHERE nombre = ?";
            $params = "s";
            $atributos = $nombre;

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


?>