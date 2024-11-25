// Array que almacenará los productos del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    
    cartItems.innerHTML = '';  // Limpiar los elementos actuales del carrito
    
    let totalCarrito = 0;
    
    carrito.forEach(producto => {
        // Crear la fila para cada producto
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>
                <button onclick="modificarCantidad('${producto.nombre}', -1)" class="btn btn-sm btn-danger">-</button>
                ${producto.cantidad}
                <button onclick="modificarCantidad('${producto.nombre}', 1)" class="btn btn-sm btn-success">+</button>
            </td>
            <td>$${producto.precio * producto.cantidad}</td>
            <td><button onclick="eliminarProducto('${producto.nombre}')" class="btn btn-sm btn-danger">Eliminar</button></td>
        `;
        
        cartItems.appendChild(row);
        
        totalCarrito += producto.precio * producto.cantidad;
    });
    
    // Actualizamos el total del carrito
    totalElement.textContent = `Total: $${totalCarrito.toFixed(2)}`;
}

// Función para modificar la cantidad de un producto
function modificarCantidad(nombre, cambio) {
    let producto = carrito.find(producto => producto.nombre === nombre);
    
    if (producto) {
        producto.cantidad += cambio;
        
        // Evitar que la cantidad sea menor a 1
        if (producto.cantidad < 1) producto.cantidad = 1;
        
        producto.total = producto.precio * producto.cantidad;
        
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizamos la vista del carrito
        actualizarCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarProducto(nombre) {
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizamos la vista del carrito
    actualizarCarrito();
}

// Función para realizar el pedido
function realizarPedido() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    
    const tipoPedido = document.getElementById('order-type').value;

    // Generar un ticket único
    const ticketNumber = 'TICKET-' + Math.floor(Math.random() * 1000000);
    
    // Mostrar el ticket y el tipo de pedido en el modal
    document.getElementById('ticket-number-modal').innerText = 'Número de ticket: ' + ticketNumber;
    document.getElementById('order-type-modal').innerText = 'Tipo de pedido: ' + tipoPedido;
    
    // Mostrar el modal
    const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
    ticketModal.show();
    
    // Enviar la orden al servidor
    fetch('http://localhost:3000/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productos: carrito,
            tipoPedido: tipoPedido,
            ticket: ticketNumber
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Pedido realizado:', data);
    })
    .catch(error => {
        console.error('Error al realizar el pedido:', error.message);
        alert('Error al realizar el pedido: ' + error.message);
    });
    
    // Limpiar el carrito después de mostrar el modal
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

// Inicializar la vista del carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarrito);