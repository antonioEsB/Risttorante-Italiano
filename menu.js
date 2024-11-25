// Array que almacenará los productos del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para incrementar la cantidad de un producto
function incrementarCantidad(button) {
    const cantidadElement = button.closest('.btncantidad').querySelector('.cantidad');
    let cantidad = parseInt(cantidadElement.textContent);
    cantidadElement.textContent = cantidad + 1;
}

// Función para decrementar la cantidad de un producto
function decrementarCantidad(button) {
    const cantidadElement = button.closest('.btncantidad').querySelector('.cantidad');
    let cantidad = parseInt(cantidadElement.textContent);
    if (cantidad > 0) {
        cantidadElement.textContent = cantidad - 1;
    }
}

// Función para agregar el producto al carrito
function agregarAlCarrito(button) {
    const card = button.closest('.card');
    const nombreProducto = card.querySelector('.card-title').textContent;
    const precioProducto = parseFloat(card.querySelector('.precio').textContent.replace('Precio: $', ''));
    const cantidadElement = card.querySelector('.cantidad');
    const cantidad = parseInt(cantidadElement.textContent);

    if (cantidad > 0) {
        const producto = {
            nombre: nombreProducto,
            precio: precioProducto,
            cantidad: cantidad
        };
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage
        alert(`${nombreProducto} ha sido agregado al carrito.`);
        console.log(carrito); // Para ver el carrito en la consola (puedes enviar esto al servidor)
    } else {
        alert('Por favor, selecciona una cantidad mayor a 0.');
    }
}

// Asignar la función agregarAlCarrito a los botones correspondientes
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        agregarAlCarrito(this);
    });
});