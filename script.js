document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito(); // Mostrar número de productos en index.html
    mostrarCarrito(); // Para carrito.html
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
    actualizarContadorCarrito(); // 🛒 Actualiza el contador en index.html
    alert(`${nombre} agregado al carrito.`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = carrito.length; // Muestra la cantidad de productos
    }
}

// Función para mostrar el carrito en la página
function mostrarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total");

    if (listaCarrito) {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            let item = document.createElement("li");
            item.textContent = `${producto.nombre} - $${producto.precio}`;
            let botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.onclick = () => {
                carrito.splice(index, 1);
                actualizarCarrito();
                mostrarCarrito();
            };
            item.appendChild(botonEliminar);
            listaCarrito.appendChild(item);
            total += Number(producto.precio);
        });

        totalElemento.textContent = total;
    }
}

// Evento para vaciar el carrito
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("vaciar-carrito")) {
        document.getElementById("vaciar-carrito").addEventListener("click", () => {
            carrito = [];
            actualizarCarrito();
            mostrarCarrito();
        });
    }
    mostrarCarrito();
});

// Evento para agregar productos desde index.html
document.querySelectorAll(".agregar-carrito").forEach(boton => {
    boton.addEventListener("click", () => {

        agregarAlCarrito(boton.dataset.nombre, boton.dataset.precio);
        actualizarContadorCarrito();

        // Si estamos en carrito.html, actualizamos PayPal
        if (document.getElementById("paypal-link")) {
            mostrarCarrito();
            actualizarTotalPaypal();
        }
    });
});

// Función para obtener el carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || []; // Si no hay carrito, devuelve un array vacío
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    let carrito = obtenerCarrito();
    let total = carrito.reduce((sum, producto) => {
        let precio = parseFloat(producto.precio) || 0; // Asegura que sea número
        let cantidad = parseInt(producto.cantidad) || 1; // Asegura que sea número
        return sum + (precio * cantidad);
    }, 0);
    return total.toFixed(2); // Redondea a 2 decimales
}

// Función para actualizar el total en PayPal
document.addEventListener("DOMContentLoaded", () => {
    actualizarTotalPaypal();
});
function actualizarTotalPaypal() {
    const total = calcularTotalCarrito();

    const totalEl = document.getElementById("contador-carrito");
    const linkEl = document.getElementById("paypal-link");

    if (!totalEl || !linkEl) return; // ← IMPORTANTE (evita fallos en index.html)

    totalEl.textContent = `$${total}`;

    const link =
        "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick" +
        "&business=maryannv25%40hotmail.com" +
        "&item_name=Compra+en+Mi+Tienda" +
        "&currency_code=USD" +
        "&amount=" + encodeURIComponent(total);

    linkEl.href = link;
}

// Funcion buscador de productos en la seccion productos //

function buscarProductos2() {
    let input = document.getElementById("buscador2").value.toLowerCase();
    let productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {
        let nombre = producto.getAttribute("data-nombre").toLowerCase();
        producto.style.display = nombre.includes(input) ? "block" : "none";
    });
}

