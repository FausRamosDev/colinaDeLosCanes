const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

$(document).ready(function () {

    const isLocalhost = window.location.hostname == 'localhost';

    const navAdmin = isLocalhost ? '/licores/partials/navAdmin.html' : '../../partials/navAdmin.html';
    const navIndex = isLocalhost ? '/licores/partials/navIndex.html' : '../../partials/navIndex.html';
    const nav = isLocalhost ? '/licores/partials/nav.html' : '../../partials/nav.html';
    const footerPath = isLocalhost ? '/licores/partials/footer.html' : '../../partials/footer.html';
    const reviews = '../../partials/reviews.html';

    $("#nav-container").load(nav);
    $("#reviews-container").load(reviews);
    $("#footer-container").load(footerPath);

    const cargarNavFooter = () => {
        let paginaActual = window.location.pathname.split('/');

        if (paginaActual.pop() == "index.html" && paginaActual.length != 4 && paginaActual.slice(-2, -1) == "") {
            $("#nav-container").load(navIndex);
        } else {
            if (paginaActual[2] == "administrador") {
                $("#nav-container").load(navAdmin);
            } else {
                $("#nav-container").load(nav);
            }
        }

        $("#footer-container").load(footerPath);
    };

    cargarNavFooter();

    const cargarLogos = async () => {
        while ($(".iconografia-logo").length == 0) {
            await delay(100);
        }

        let paginaActual = window.location.pathname.split('/');

        if (paginaActual.pop() == "index.html" && paginaActual.length != 4 && paginaActual.slice(-2, -1) == "") {
            $(".iconografia-logo").attr("src", "assets/images/iconografia-logo.png");

            $(".logo-facebook").attr("src", "assets/images/facebook-logo.png");
            $(".logo-instagram").attr("src", "assets/images/instagram-logo.png");
            $(".logo-gmail").attr("src", "assets/images/gmail-logo.png");
        } else {
            $(".iconografia-logo").attr("src", "../../assets/images/iconografia-logo.png");

            $(".logo-facebook").attr("src", "../../assets/images/facebook-logo.png");
            $(".logo-instagram").attr("src", "../../assets/images/instagram-logo.png");
            $(".logo-gmail").attr("src", "../../assets/images/gmail-logo.png");
        }
    }

    cargarLogos();

    $(document).on("click", ".button-icon-list", () => {
        if ($(".menu-adaptable-ul").css("display") == "none") {
            $(".menu-adaptable-ul").css("display", "block");
            $(".menu-adaptable").css("border-bottom", "1px solid white");
            $(".menu-adaptable").css("background-color", "rgba(0, 15, 0, 0.8)");
            $(".menu-adaptable-ul").css("height", "100vh");
            $(".boton-inicio").css("display", "none");
            $("#wallet_container").css("display", "none");
        } else {
            $(".menu-adaptable-ul").css("display", "none");
            $(".menu-adaptable").css("border-bottom", "none");
            $(".menu-adaptable").css("background-color", "transparent");
            $(".boton-inicio").css("display", "block");
            $("#wallet_container").css("display", "block");
        }
    });

    const contarEstrellas = (cantidad) => {
        var estrellas = "⭐";
        for (let i = 1; i < cantidad; i++) {
            estrellas += "⭐";
        }
        return estrellas;
    }

    window.cargarReviews = () => {
        $.ajax({
            url: "../../backend/controllers/controlador.php",
            type: "GET",
            data: {
                funcionalidad: "gestionarReviews",
            },
            success: (response) => {
                try {
                    let respuesta = JSON.parse(response);
                    let paginaActual = window.location.pathname.split('/');
                    $(".carousel-inner").html("");
                    let divReviews = $(".carousel-inner");
                    if (respuesta) {
                        if (paginaActual[2] == "administrador") {
                            respuesta.forEach(element => {
                            divReviews.append(
                                `<div class="card-review">
                                <p class="descripcion-review">"${element.descripcion}"</p>
                                <p class="nombre-review">${element.nombre}</p>
                                <p class="estrellas-review">${contarEstrellas(element.estrellas)}</p>
                                <button class="button-eliminar-review">Eliminar</button>
                                </div>`);
                            }); 
                        } else {
                            respuesta.forEach(element => {
                            divReviews.append(
                                `<div class="card-review">
                                <p class="descripcion-review">"${element.descripcion}"</p>
                                <p class="nombre-review">${element.nombre}</p>
                                <p class="estrellas-review">${contarEstrellas(element.estrellas)}</p>
                                </div>`);
                            });
                        }
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

    cargarReviews(reviews);
})