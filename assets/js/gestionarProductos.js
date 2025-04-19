$(document).ready(() => {
    let imagen;
    var largo = 0;

    const cargarBotonAlta = () => {

    }

    const cargarProductos = () => {
        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "GET",
            data: {
                funcionalidad: "gestionarProductos",
            },
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    $(".products-section").html("");
                    let divProductos = $(".products-section");
                    if (respuesta) {
                        respuesta.forEach(element => {
                            divProductos.append(
                            `<div class="product-card">
                                <img src="../../assets/images/productos/${element.imagen}" alt="Producto 2" class="product-image">
                                <h2 class="product-title">${element.titulo}</h2> 
                                <p class="product-description">ID: <span class="id-producto">${element.id}</span></p>
                                <p class="product-description">${element.descripcion}</p>
                                <button class="modificar-producto add-to-cart">Modificar producto</button>
                                <button class="eliminar-producto add-to-cart">Eliminar producto</button>
                            </div>`);
                        });
                        cargarBotonAlta();
                    } else {
                        alert("No hay productos en la base de datos.");
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

    cargarProductos();

    $('#producto-form').on('submit', function (e) {
        e.preventDefault();
    
        const formData = new FormData(this);
        formData.append('file', imagen);
        formData.append('funcionalidad', "gestionarProductos");
    
        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false, 
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta === true) {
                        alert("Producto guardado correctamente.");
                        cargarProductos();
                    } else {
                        alert("Ocurrió un error al guardar el producto.");
                        cargarProductos();
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
            },
            error: (error) => {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    });    

    $('#imagen').on('change', function (files) {
        imagen = files.target.files[0];
    });

    const eliminarProducto = (id) => {
        
        const datos = {
            id: id
        }

        const parametros = `?id=${id}&funcionalidad=gestionarProductos`;

        $.ajax({
            url: `../../backend/controllers/controlador.php${parametros}`,
            type: "DELETE",
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta) {
                        alert("Producto eliminado correctamente.");
                        cargarProductos();
                    } else {
                        alert("Ocurrió un error al eliminar el producto.");
                        cargarProductos();
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

    const modificarProducto = (formData) => {

        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false, 
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    if (respuesta) {
                        alert("Producto modificado correctamente.");
                        cargarProductos();
                    } else {
                        alert("Ocurrió un error al modificar el producto.");
                        cargarProductos();
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: " + e);
                }
            },
            error: (error) => {
                console.error("Error en la solicitud AJAX:" + error);
            }
        });
    }

    $(document).on("click", ".eliminar-producto", function (id) {
        id = $(this).closest(".product-card").find(".id-producto").text();
        $("#popup-eliminar").css("display", "flex");
        $(".id-eliminar-producto").html(id);
    });

    $(document).on("click", ".confirmar-eliminar", function (id) {
        id = $(".id-eliminar-producto").text();
        $("#popup-eliminar").css("display", "none");
        eliminarProducto(id);
    });

    $(document).on("click", ".modificar-producto", function () {
        const id = $(this).closest(".product-card").find(".id-producto").text();
        $("#popup-modificar").css('display', 'flex');
        $(".logos-redes").css("visibility", "hidden");
        $(".id-producto-modificar").html(id);
        $("#titulo-modificar").val($(this).closest(".product-card").find(".product-title").text());
        sessionStorage.setItem("id-modificar", id);
    });

    $('#producto-form-modificar').on('submit', function (e) {
        e.preventDefault();
        const inputFile = document.getElementById("imagen-modificar");
        const file = inputFile.files[0];
        const formData = new FormData(this);
        formData.append('file', file);
        formData.append('funcionalidad', "gestionarProductos");
        formData.append("idProducto", $(".id-producto-modificar").text());
        modificarProducto(formData);
    });

    $(document).on("click", ".close-popup", () => {
        $('#popup').css('display', 'none');
        $("#popup-modificar").css('display', 'none');
        $("#popup-eliminar").css("display", "none");
        $("#popup-review").css("display", "none");
        $(".card-review").css("display", "flex");
        $(".logos-redes").css("visibility", "visible");
        sessionStorage.removeItem("id-modificar");
    });

    $(document).on("click", ".boton-cancelar", () => {
        $('#popup').css('display', 'none');
        $("#popup-modificar").css('display', 'none');
        $("#popup-eliminar").css("display", "none");
        $("#popup-review").css("display", "none");
        $(".card-review").css("display", "flex");
        $(".logos-redes").css("visibility", "visible");
        sessionStorage.removeItem("id-modificar");
    });

    $("#nuevo-producto").click(() => {
        $('#popup').css('display', 'flex');
        $(".logos-redes").css("visibility", "hidden");
    });

    $(document).on("input", "#descripcion", function(largo) {
            largo = $("#descripcion").val();
            $(".contador-palabras").html(largo.length);
    });    

});