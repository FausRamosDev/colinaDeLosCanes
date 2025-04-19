$(document).ready(() => {

    const enviarDatos = (datos) => {
        $.ajax({
            url: "../../../backend/controllers/controlador.php",
            type: "POST",
            data: {
                funcionalidad: "guardarVenta",
                datos:  datos,
            },
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta === true) {
                        alert("Datos guardados con éxito.");
                    } else {
                        alert("Hubo un error al guardar tus datos. Por favor, envianos un mensaje desde la página de contacto.");
                        $(".boton-contacto").css("display", "flex");
                    }
                } catch (e) {
                    console.error("Error al parsear el JSON: " + e);
                }
            },
            error: (e) => {
                console.error("Error AJAX: " + e);
            }
        })
    }

  $("#form-success").on("submit", function (e) {
    e.preventDefault();

    $(".boton-contacto").css("display", "block");

    const productos = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const producto = JSON.parse(sessionStorage.getItem(key));
      if (producto) {
        productos.push(producto);
      }
    }
    
    const params = new URLSearchParams(window.location.search);

    const datosVenta = {
        productos: productos,
        nombre: $("#input-nombre").val(),
        telefono: $("#input-telefono").val(),
        correo: $("#input-correo").val(),
        collection_id: params.get("collection_id"),
        collection_status: params.get("collection_status"),
        payment_id: params.get("payment_id"),
        status: params.get("status"),
        payment_type: params.get("payment_type"),
        preference_id: params.get("preference_id"),
        merchant_order_id: params.get("merchant_order_id"),
    }

    enviarDatos(datosVenta);    
  });

});
