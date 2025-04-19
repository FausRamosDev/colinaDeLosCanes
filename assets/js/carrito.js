$(document).ready(() => {
  const calcularPrecioFinal = () => {
    let precioFinal = 0;
    $(".product-card").each(function () {
      const precio = parseFloat($(this).find(".precio-producto").text()) || 0;
      precioFinal += precio;
    });
    $(".precio-final").text(precioFinal);
  };

  const mostrarProductos = (productos) => {
    const seccionProductos = $(".products-section");
    seccionProductos.empty();

    productos.forEach((element) => {
      const productoStorage = sessionStorage.getItem(`producto${element.id}`);
      const productoData = productoStorage ? JSON.parse(productoStorage) : {};

      const productoHTML = `
                <div class="product-card" data-id="${element.id}">
                    <img src="../../assets/images/productos/${
                      element.imagen
                    }" alt="${element.titulo}" class="product-image">
                    <h2 class="product-title">${element.titulo}</h2>
                    <p class="product-description product-id">ID: <span>${
                      element.id
                    }</p>
                    <p class="product-description">${element.descripcion}</p>
                    <div class="quantity-controller">
                        <button class="restar-cantidad">-</button>
                        <span class="cantidad" data-id="${element.id}">${
        productoData.cantidad || 1
      }</span>
                        <button class="sumar-cantidad">+</button>
                    </div>
                    <p class="precio-producto-p">Medida: <span class="medida-producto" data-id="${
                      element.id
                    }">${productoData.medida || 0}</span>ml</p>
                    <p class="precio-producto-p">Precio: $<span class="precio-producto" data-id="${
                      element.id
                    }">${productoData.precio || 0}</span></p>
                    <button class="remove-from-cart" data-id="${
                      element.id
                    }">Eliminar del carrito</button>
                </div>`;
      seccionProductos.append(productoHTML);
    });

    calcularPrecioFinal();
  };

  const obtenerProductos = () => {
    const ids = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const producto = JSON.parse(sessionStorage.getItem(key));
      if (producto && producto.id) {
        ids.push(producto.id);
      }
    }

    if (ids.length > 0) {
      $.ajax({
        url: "../../backend/controllers/controlador.php",
        type: "GET",
        data: {
          funcionalidad: "gestionarProductos",
          datos: { id: ids },
        },
        success: (response) => {
          try {
            const respuesta = JSON.parse(response);
            if (respuesta) {
              mostrarProductos(respuesta);
            } else {
              alert("No hay productos en la base de datos.");
            }
          } catch (e) {
            console.error("Error al procesar la respuesta del servidor: ", e);
          }
        },
        error: (error) => {
          console.error("Error en la solicitud AJAX:", error);
        },
      });
    }
  };

  const actualizarProductoEnStorage = (id, cantidad, precio) => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const producto = JSON.parse(sessionStorage.getItem(key));
      if (producto.id === id) {
        producto.cantidad = cantidad;
        producto.precio = precio;
        sessionStorage.setItem(key, JSON.stringify(producto));
        datos();
        break;
      }
    }
  };

  const actualizarPrecios = () => {
    $(".product-card").each(function () {
      const card = $(this);
      const id = card.attr("data-id");
      const medida = parseFloat(card.find(".medida-producto").text()) || 0;
      const cantidad = parseInt(card.find(".cantidad").text()) || 1;
      const precioPorMedida = { 200: 265, 250: 295, 700: 570 };
      const precio = (precioPorMedida[medida] || 0) * cantidad;

      card.find(".precio-producto").text(precio);
      actualizarProductoEnStorage(id, cantidad, precio);
    });

    calcularPrecioFinal();
  };

  const gestionarBotones = () => {
    $(".sumar-cantidad").css("cursor", "not-allowed");
    $(".restar-cantidad").css("cursor", "not-allowed");

    $(".sumar-cantidad").css("background", "grey");
    $(".restar-cantidad").css("background", "grey");

    $(".sumar-cantidad").hover(function() {
        $(this).css("background","grey")
      });
      $(".restar-cantidad").hover(function() {
        $(this).css("background","grey")
      });

    $(".sumar-cantidad").prop("disabled", true);
    $(".restar-cantidad").prop("disabled", true);

    setTimeout(() => {
      $(".sumar-cantidad").css("cursor", "pointer");
      $(".restar-cantidad").css("cursor", "pointer");

      $(".sumar-cantidad").css("background", "#1e88e5");
      $(".restar-cantidad").css("background", "#1e88e5");

      $(".sumar-cantidad").hover(function() {
        $(this).css("background","#1565c0")
      });

      $(".restar-cantidad").hover(function() {
        $(this).css("background","#1565c0")
      });

      $(".sumar-cantidad").prop("disabled", false);
      $(".restar-cantidad").prop("disabled", false);
    }, 1500);
  };

  $(document).on("click", ".sumar-cantidad", function () {
    gestionarBotones();
    const $cantidad = $(this).siblings(".cantidad");
    let cantidad = parseInt($cantidad.text()) || 1;
    cantidad++;
    $cantidad.text(cantidad);
    actualizarPrecios();
  });

  $(document).on("click", ".restar-cantidad", function () {
    gestionarBotones();
    const $cantidad = $(this).siblings(".cantidad");
    let cantidad = parseInt($cantidad.text()) || 1;
    if (cantidad > 1) {
      cantidad--;
      $cantidad.text(cantidad);
      actualizarPrecios();
    }
  });

  $(document).on("click", ".remove-from-cart", function () {
    const id = $(this).data("id");
    $(`.product-card[data-id="${id}"]`).remove();
    sessionStorage.removeItem(`producto${id}`);
    actualizarPrecios();
  });

  obtenerProductos();
});
