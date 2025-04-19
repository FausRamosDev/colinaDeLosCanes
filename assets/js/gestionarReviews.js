$(document).ready(() => {

    const altaReview = (datos) => {
        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: {
                ...datos,
                funcionalidad: "gestionarReviews"
            },
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta === true) {
                        alert("Review guardada correctamente.");
                        cargarReviews();
                    } else {
                        alert("Ocurrió un error al guardar la review.");
                        cargarReviews();
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
            },
            error: (error) => {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    }

    const bajaReview = (nombre) => {
        const parametros = `?nombre=${nombre}&funcionalidad=gestionarReviews`;
        $.ajax({
            url: `../../backend/controllers/controlador.php${parametros}`,
            type: "DELETE",
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta === true) {
                        alert("Review eliminada correctamente.");
                        cargarReviews();
                    } else {
                        alert("Ocurrió un error al eliminar la review.");
                        cargarReviews();
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
            },
            error: (error) => {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    }

    const datosAlta = () => {
        let nombre = $("#nombre").val();
        let descripcion = $("#descripcion-review").val();
        let estrellas = $("#estrellas").val();

        if (nombre && descripcion && estrellas) {
            let datos = {
                nombre: nombre,
                descripcion: descripcion,
                estrellas: estrellas
            }

            altaReview(datos);

            
            $(".card-review").css("display", "flex");
            $("#popup-review").css("display", "none");
        } else {
            alert("Por favor complete todos los campos.");
        }
    }

    const mostrarPopup = () => {
        $(".card-review").css("display", "none");
        $("#popup-review").css("display", "flex");
    }

    $(document).on("click", ".button-eliminar-review", function () {
        let nombre = $(this).closest(".card-review").find(".nombre-review").text();
        bajaReview(nombre);
    });

    $(document).on("input", "#descripcion-review", function (largo) {
        largo = $("#descripcion-review").val();
        $(".contador-palabras-review").html(largo.length);
    });

    $(".boton-guardar-review").click(datosAlta);
    $("#nueva-review").click(mostrarPopup);

});