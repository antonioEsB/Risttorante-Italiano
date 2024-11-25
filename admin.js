// Función para buscar una reservación por ID
function searchReservation() {
    // Obtener el ID de la reservación desde el campo de búsqueda
    const searchId = document.getElementById('search-id').value;

    // Realizar una solicitud a la API para buscar la reservación por ID
    fetch(`https://risttorante-italiano-production.up.railway.app/reservacion/${searchId}`)
        .then(response => {
            // Verificar si la respuesta del servidor es correcta
            if (response.ok) {
                // Convertir la respuesta a JSON
                return response.json();
            } else {
                // Lanzar un error si la reservación no se encuentra
                throw new Error('Reservación no encontrada');
            }
        })
        .then(data => {
            // Obtener la lista de reservaciones (tabla)
            const reservationsList = document.getElementById('reservations-list');

            // Actualizar el contenido de la tabla con la reservación encontrada
            reservationsList.innerHTML = `
                <tr>
                    <td>${data.id_Reservacion}</td>
                    <td>${data.nombre}</td>
                    <td>${data.apellido}</td>
                    <td>${data.correo}</td>
                    <td>${data.tel}</td>
                    <td>${data.fecha}</td>
                    <td>${data.hora}</td>
                    <td>${data.cantidad}</td>
                    <td>${data.comentarios}</td>
                    <td><button class="btn btn-danger" onclick="deleteReservation(${data.id_Reservacion})">Eliminar</button></td>
                </tr>
            `;
        })
        .catch(error => {
            // Mostrar un mensaje de error si la reservación no se encuentra o hay un fallo
            alert(error.message);
        });
}

// Función para eliminar una reservación
function deleteReservation(id) {
    // Confirmar que el usuario realmente quiere eliminar la reservación
    if (confirm(`¿Seguro que quieres eliminar la reservación con ID ${id}?`)) {
        // Realizar una solicitud DELETE a la API para eliminar la reservación
        fetch(`https://risttorante-italiano-production.up.railway.app/reservacion/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            // Si la respuesta es OK (200), significa que se eliminó correctamente
            if (response.ok) {
                // Mostrar un mensaje de éxito
                alert('Reservación eliminada correctamente');

                // Buscar la fila correspondiente a la reservación en la tabla y eliminarla
                const row = document.querySelector(`tr td:first-child`).innerText == id ? document.querySelector(`tr td:first-child`).parentNode : null;
                if (row) {
                    row.remove();
                }
            } else {
                // Si hubo algún error al eliminar, mostrar un mensaje de error
                alert('Error al eliminar la reservación');
            }
        })
        .catch(error => {
            // Si hay un error en la solicitud, mostrar un mensaje de error en consola y en la interfaz
            console.error('Error al eliminar la reservación:', error);
            alert('Error al eliminar la reservación');
        });
    }
}

// Función para buscar un pedido por número de ticket
function searchTicket() {
    const ticketNumber = document.getElementById('search-ticket').value;

    fetch(`https://risttorante-italiano-production.up.railway.app/pedido/${ticketNumber}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Pedido no encontrado');
            }
        })
        .then(data => {
            const ticketList = document.getElementById('ticket-list');
            const { pedido, productos } = data;

            ticketList.innerHTML = `
                <tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.ticket}</td>
                    <td>${pedido.tipo_pedido}</td>
                    <td><button class="btn btn-danger" onclick="deleteTicket('${pedido.ticket}')">Eliminar</button></td>
                </tr>
            `;

            const productList = document.getElementById('product-list');
            productList.innerHTML = productos.map(producto => `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                </tr>
            `).join('');
        })
        .catch(error => {
            alert(error.message);
        });
}

// Función para eliminar un pedido por número de ticket
function deleteTicket(ticket) {
    if (confirm(`¿Seguro que quieres eliminar el pedido con ticket ${ticket}?`)) {
        fetch(`https://risttorante-italiano-production.up.railway.app/pedido/${ticket}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Pedido eliminado correctamente');
                document.getElementById('ticket-list').innerHTML = '';
                document.getElementById('product-list').innerHTML = '';
            } else {
                alert('Error al eliminar el pedido');
            }
        })
        .catch(error => {
            console.error('Error al eliminar el pedido:', error);
            alert('Error al eliminar el pedido');
        });
    }
}
