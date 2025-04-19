$(document).ready(() => {
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
        mostrarModal("modalEnviando", "Enviando...");

        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: {
                ...datos,
                funcionalidad: "contacto",
            },
            success: (response) => {
                try {
                    const respuesta = JSON.parse(response);
                    if (respuesta) {
                        mostrarModal("modalEnviando", "Correo enviado con éxito.");
                        setTimeout(() => ocultarModal("modalEnviando"), 2500);
                    } else {
                        mostrarModal("modalEnviando", respuesta.error || "Hubo un problema al enviar el correo.");
                        setTimeout(() => ocultarModal("modalEnviando"), 2500);
                    }
                } catch (e) {
                    console.log("Error al parsear el JSON: " + e);
                    mostrarModal("modalEnviando", "Ocurrió un error inesperado.");
                    setTimeout(() => ocultarModal("modalEnviando"), 2500);
                }
            },
            error: (e) => {
                console.log("Error AJAX: " + e);
                mostrarModal("modalEnviando", "No se pudo enviar el correo. Inténtelo más tarde.");
            }
        });
    };

    const filtrarDatos = (nombre, correo, mensaje) => {
        if (!nombre || !correo || !mensaje) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (!/^[a-zA-Z\s]{2,}$/.test(nombre)) {
            alert("El nombre debe contener solo letras y al menos 2 caracteres.");
            return;
        }

        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
            alert("El correo no es válido.");
            return;
        }

        if (mensaje.length < 5) {
            alert("El mensaje debe tener al menos 5 caracteres.");
            return;
        }

        if (mensaje.length > 500) {
            alert("El mensaje no puede tener más de 500 caracteres.");
            return;
        }

        nombre = nombre.trim();
        correo = correo.trim();
        mensaje = mensaje.trim();

        const datos = { nombre, correo, mensaje };
        enviarDatos(datos);
    };

    const tomarDatos = (event) => {
        event.preventDefault();
        const nombre = $(".input-nombre").val();
        const correo = $(".input-correo").val();
        const mensaje = $(".input-mensaje").val();

        filtrarDatos(nombre, correo, mensaje);
    };

    $(".boton-enviar-correo").click(tomarDatos);
});
