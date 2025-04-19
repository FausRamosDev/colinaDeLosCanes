<?php

use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

require '../../vendor/autoload.php';

function mercadoPago($id, $title, $quantity, $unitPrice)
{

    MercadoPagoConfig::setAccessToken('');

    $client = new PreferenceClient();

    $preference = $client->create([
        "items" => [
            [
                "id" => $id,
                "title" => $title,
                "quantity" => $quantity,
                "unit_price" => $unitPrice
            ]
        ],
        "statement_descriptor" => "ColinaDeLosCanes",
        "back_urls" => [
            "success" => "http://localhost/licores/pages/cliente/post-venta/success.html",
            "failure" => "http://localhost/licores/pages/cliente/post-venta/failure.html",
            "pending" => "http://localhost/licores/pages/cliente/post-venta/pending.html"
        ],
        "auto_return" => "approved"
    ]);

    return $preference;
}

?>
