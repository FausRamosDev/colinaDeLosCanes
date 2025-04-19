$(document).ready(() => {
    const sesion = sessionStorage.getItem("usuario");

    if (!sesion) {
        alert("Acceso no autorizado.");
        window.location = "../../index.html";
    }
})

