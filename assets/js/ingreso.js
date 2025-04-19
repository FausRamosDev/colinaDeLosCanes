$(document).ready(() => {

    const tomarDatos = () => {
        const usuario = $(".nombre-usuario").val();
        const contrasenia = $(".contrasenia").val();

        return {
            usuario: usuario,
            contrasenia: contrasenia,
        };
    }

    $(".form-ingreso").on("submit", (e) => {
        e.preventDefault();

        const datos = tomarDatos();

        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: {
                datos,
                funcionalidad: "ingreso",
            },
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta) {
                        location.href = "../administrador/index.html";
                        sessionStorage.setItem("usuario", JSON.stringify(datos));
                    } else {
                        alert("Datos no encontrados.");
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
            },
            error: (error) => {
                console.error("Error en la solicitud AJAX:", error);
            }
        })
    });


    const cerrarSesion = () => {
        localStorage.clear;
        alert("Saliendo...");
        window.location = "../../index.html";
    }

    $(".cerrar-sesion").click(cerrarSesion);
})