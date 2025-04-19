$(document).ready(() => {

    const limpiarCarrito = () => {
        sessionStorage.clear();
    }
    
    const mostrarModal = (idModal, mensaje) => {
        const modal = $(`#${idModal}`);
        if (mensaje) {
            modal.find(".modal-content p").text(mensaje);
        }
        modal.fadeIn();
    };

    const ocultarModal = (idModal) => {
        $(`#${idModal}`).fadeOut();
    };
    
    const enviarDatos = (datos) => {
        mostrarModal("modalEnviando", "Reservando...");

        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: {
                ...datos,
                funcionalidad: "reservarProductos"
            },
            success: (response) => {
                try {
                    const respuesta = JSON.parse(response);
                    if (respuesta) {
                        mostrarModal("modalEnviando", "Productos reservados con éxito. Nos contactaremos contigo para concretar la venta.");
                        setTimeout(() => ocultarModal("modalEnviando"), 5000);
                        limpiarCarrito();
                    } else {
                        mostrarModal("modalEnviando", respuesta.error || "Hubo un problema al reservar los productos.");
                        setTimeout(() => ocultarModal("modalEnviando"), 1500);
                    }
                } catch (e) {
                    console.log("Error al parsear el JSON: " + e);
                    mostrarModal("modalEnviando", "Ocurrió un error inesperado.");
                }
            },
            error: (e) => {
                console.log("Error AJAX: " + e);
                mostrarModal("modalEnviando", "No se pudo enviar el correo. Inténtelo más tarde.");
            }
        });
    };

    const mostrarPopup = () => {
        $(".popup-reserva").css("display", "flex");
        $("#wallet_container").css("display", "none");
    }

    const cerrarPopup = () => {
        $(".popup-reserva").css("display", "none");
        $("#wallet_container").css("display", "block");
    }

    $(".reservar-productos").click(mostrarPopup);
    $(".cerrar-popup").click(cerrarPopup);

    $("#producto-form-reserva").on("submit", function (e) {
        e.preventDefault();

        if (sessionStorage.length > 0) {
            let nombre = $(".input-nombre").val();
            let telefono = $(".input-telefono").val();
            let mensaje = $(".input-mensaje").val();
            const ids = [];
            const cantidades = [];
            const medidas = [];
    
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const producto = JSON.parse(sessionStorage.getItem(key));
                if (producto && producto.id) {
                    ids.push(producto.id);
                    cantidades.push(producto.cantidad);
                    medidas.push(producto.medida);
                }
            }
    
            const productos = [];
    
            for (let i = 0; i < ids.length; i++) {
                const producto = {
                    id: ids[i],
                    cantidad: cantidades[i],
                    medida: medidas[i]
                }
    
                productos.push(producto);
            }
            
            console.log(productos);
    
            const datos = {
                nombre: nombre,
                telefono: telefono,
                mensaje: mensaje,
                productos: productos
            }
    
            enviarDatos(datos);
        } else {
            alert("Primero debe seleccionar productos.");
        }        
    });
});