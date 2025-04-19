$(document).ready(() => {

    let cantidad = 1;
    let precioActual = 0;

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
                                <button class="add-to-cart">Agregar al carrito</button>
                            </div>`);
                        });
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

    //funciones popup

    window.actualizarPrecioPopup = () => {
        const precioTotal = (precioActual * cantidad);
        $('#popup-price').html(`Precio total: $<span class="precio-final-producto">${precioTotal}</span>`);
    }

    $('#medida-select').on('change', function () {
        const precioPorMedida = {
            0: 0,
            200: 265,
            250: 295,
            700: 570,
        };
        precioActual = precioPorMedida[$(this).val()] || 0;
        actualizarPrecioPopup();
    });


    window.cerrarPopup = () => {
        $('#popup').css('display', 'none');
    }

    window.actualizarCantidad = (cambio) => {
        cantidad = Math.max(1, cantidad + cambio);
        $('#cantidad').text(cantidad);
        actualizarPrecioPopup();
    }

    const mostrarPopup = (id, nombreProducto, precio) => {
        $('#popup-title').text(nombreProducto);
        $(".id-producto-popup").html(`ID: <span class="id-producto-mostrar-popup">${id}</span>`);
        precioActual = precio;
        cantidad = 1;
        $('#cantidad').text(cantidad);
        actualizarPrecioPopup();
        $('#popup').css('display', 'flex');
    }

    $(document).on("click", ".add-to-cart", function() {
        let id = $(this).closest(".product-card").find(".id-producto").text();
        let nombre = $(this).closest(".product-card").find(".product-title").text();
        mostrarPopup(id, nombre, 0);
    });

    const guardarProdCarrito = (producto) => {
        sessionStorage.setItem(`producto${producto.id}`, JSON.stringify(producto));
        alert("Producto agregado al carrito.");
        $('#popup').css('display', 'none');
    }   

    $(document).on("click", ".confirm-add", function() {
        const id = $(".id-producto-mostrar-popup").text();
        const medida = $("#medida-select").val();
        const cantidad = $("#cantidad").text();
        const precio = $(".precio-final-producto").text();

        if (medida != 0) {
            const producto = {
                id: id,
                medida: medida,
                cantidad: cantidad,
                precio: precio,
            }
    
            guardarProdCarrito(producto);
        } else {
            alert("Por favor ingrese una medida.");
        }
        
        
    });   

})