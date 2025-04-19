<?php
require_once("../config/database.php");

function ingresarAlSistema($sql, $params, $atributos)
{
    global $conexion;

    try {

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

        return $result->num_rows > 0;
    } catch (Exception $e) {
        die($e->getMessage());
    }
}

?>