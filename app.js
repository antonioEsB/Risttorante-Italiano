require('dotenv').config();//importar dotenv para cargar las variables de entorno desde el archivo .env

const express = require('express');//import express para la creacion de la aplicacion 
const app = express();//creacion de la aplicacion 

const mysql = require('mysql2');//import mysql para la conexion con la base de datos
const port = 3000;//puerto de la aplicacion 

const bodyParser = require('body-parser');//import body-parser para manejar los datos de las peticiones http en formato json 

const cors = require('cors');//import cors para permitir el acceso a la aplicacion desde cualquier origen 
app.use(cors()); 

const session = require('express-session');//import session para manejar sesiones de usuario

//Configurar el middleware para analizar el cuerpo de las solicitudes en formato json 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Configurar el middleware para manejar sesiones de usuario 
app.use(session({
    secret: 'secret',//clave secreta para firmar la cookie de la sesion
    resave: false, // No volver a guardar la sesion si no ha sido modificada
    saveUninitialized: false, // No guardar la sesion si no ha sido inicializada
    cookie: { maxAge: 60000 } //tiempo de vida de la cookie en milisegundos
}));

//Configurar la conexion con la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Conectar a la base de datos
db.connect((err) => {//funcion de callback que se ejecuta cuando se intenta conectar a la base de datos 
    if (err) {//si hay un error en la conexion 
        console.error('Error al conectar a la base de datos: ' + err.stack);//se imprime el error en la consola 
    } else {//si la conexion es exitosa
        console.log('Conexión exitosa a la base de datos');//
    }
});

//Ruta para manejar el formulario de reservacion 
app.post('/reservacion', (req, res) =>{
    console.log(req.body);
    const { nombre, apellido, correo, tel, fecha, hora, personas, comentarios } = req.body;
    
    const sql_query = 'INSERT INTO reservacion (nombre, apellido, correo, tel, fecha, hora, cantidad, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql_query, [nombre, apellido, correo, tel, fecha, hora, personas, comentarios], (err) => {
            if (err) {
                console.error('Error al insertar la reservación: ' + err.stack);
                res.status(500).send('Error al insertar la reservación');
            }else {
                console.log('Reservación insertada correctamente');
                res.status(200).send('Reservación insertada correctamente');
            }
        }
    );
});


// Ruta para buscar una reservación por ID
app.get('/reservacion/:id', (req, res) => {
    const reservacionId = req.params.id;
    const sql_query = 'SELECT * FROM reservacion WHERE id_Reservacion = ?';
    
    db.query(sql_query, [reservacionId], (err, result) => {
        if (err) {
            console.error('Error al buscar la reservación: ' + err.stack);
            res.status(500).send('Error al buscar la reservación');
        } else if (result.length === 0) {
            res.status(404).send('Reservación no encontrada');
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Ruta para eliminar una reservación por ID
app.delete('/reservacion/:id', (req, res) => {
    const reservacionId = req.params.id;
    const sql_query = 'DELETE FROM reservacion WHERE id_Reservacion = ?';
    
    db.query(sql_query, [reservacionId], (err, result) => {
        if (err) {
            console.error('Error al eliminar la reservación: ' + err.stack);
            res.status(500).send('Error al eliminar la reservación');
        } else if (result.affectedRows > 0) {
            res.status(200).send('Reservación eliminada correctamente');
        } else {
            res.status(404).send('Reservación no encontrada');
        }
    });
});

//Creacion del usuario login
app.post('/registrar', (req, res) => {
    console.log(req.body); // Esto ayudará a identificar el problema
    const { nombre, correo, password } = req.body;

    if (!password) {
        return res.status(400).send('La contraseña es obligatoria');
    }

    const sql_query = 'INSERT INTO login (nombre, correo, contrasena) VALUES (?, ?, ?)';
    db.query(sql_query, [nombre, correo, password], (err) => {
        if (err) {
            console.error('Error al insertar el usuario: ' + err.stack);
            return res.status(500).send('Error al insertar el usuario');
        } else {
            return res.status(200).send('Usuario registrado correctamente');
        }
    });
});


//verificar usuario mediante el correo y contraseña
app.post('/login', (req, res) => {
    console.log(req.body);
    const { correo, contrasena } = req.body;

    const sql_query = 'SELECT * FROM login WHERE correo = ?';
    db.query(sql_query, [correo], (err, result) => {
        if (err) {
            console.error('Error al buscar el usuario: ' + err.stack);
            return res.status(500).send('Error al buscar el usuario');
        } else if (result.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        } else {
            // Comparar las contraseñas directamente en texto plano
            if (contrasena === result[0].contrasena) {
                req.session.usuario = result[0].nombre; // Establecer el nombre en la sesión
                return res.status(200).json({ redirect: '/proyectoFinal.html' }); // Redirigir al frontend
            } else {
                return res.status(401).send('Contraseña incorrecta');
            }
        }
    });
});

// Ruta para manejar el carrito de compras
app.post('/carrito', (req, res) => {
    console.log(req.body);
    const { productos, tipoPedido, ticket } = req.body;

    // Verificar si los productos no están vacíos
    if (!productos || productos.length === 0) {
        return res.status(400).send('El carrito está vacío');
    }

    // Guardar el pedido principal
    const sql_query = 'INSERT INTO pedidos (ticket, tipo_pedido) VALUES (?, ?)';
    db.query(sql_query, [ticket, tipoPedido], (err, result) => {
        if (err) {
            console.error('Error al insertar el pedido: ' + err.stack);
            return res.status(500).send('Error al procesar el pedido');
        }

        const pedidoId = result.insertId; // Obtén el ID del pedido insertado

        // Guardar los productos del carrito
        productos.forEach(producto => {
            const sql_query_productos = 'INSERT INTO productos_pedido (fk_pedidos, nombre, precio, cantidad) VALUES (?, ?, ?, ?)';
            db.query(sql_query_productos, [pedidoId, producto.nombre, producto.precio, producto.cantidad], (err) => {
                if (err) {
                    console.error('Error al insertar los productos: ' + err.stack);
                }
            });
        });

        res.status(200).json({ mensaje: 'Pedido realizado correctamente', ticket: ticket });
    });
});

// Ruta para buscar un pedido por ticket
app.get('/pedido/:ticket', (req, res) => {
    const ticket = req.params.ticket;
    const sql_query_pedido = 'SELECT * FROM pedidos WHERE ticket = ?';

    db.query(sql_query_pedido, [ticket], (err, result) => {
        if (err) {
            console.error('Error al buscar el pedido: ' + err.stack);
            return res.status(500).send('Error al buscar el pedido');
        } else if (result.length === 0) {
            return res.status(404).send('Pedido no encontrado');
        } else {
            const pedido = result[0];
            const sql_query_productos = 'SELECT * FROM productos_pedido WHERE fk_pedidos = ?';
            
            db.query(sql_query_productos, [pedido.id], (err, productos) => {
                if (err) {
                    console.error('Error al buscar los productos del pedido: ' + err.stack);
                    return res.status(500).send('Error al buscar los productos del pedido');
                } else {
                    res.status(200).json({ pedido, productos });
                }
            });
        }
    });
});

// Ruta para eliminar un pedido por ticket
app.delete('/pedido/:ticket', (req, res) => {
    const ticket = req.params.ticket;
    const sql_query_pedido = 'SELECT id FROM pedidos WHERE ticket = ?';
    
    db.query(sql_query_pedido, [ticket], (err, result) => {
        if (err) {
            console.error('Error al buscar el pedido: ' + err.stack);
            return res.status(500).send('Error al buscar el pedido');
        } else if (result.length === 0) {
            return res.status(404).send('Pedido no encontrado');
        } else {
            const pedidoId = result[0].id;
            const sql_delete_productos = 'DELETE FROM productos_pedido WHERE fk_pedidos = ?';
            
            db.query(sql_delete_productos, [pedidoId], (err) => {
                if (err) {
                    console.error('Error al eliminar los productos del pedido: ' + err.stack);
                    return res.status(500).send('Error al eliminar los productos del pedido');
                } else {
                    const sql_delete_pedido = 'DELETE FROM pedidos WHERE id = ?';
                    
                    db.query(sql_delete_pedido, [pedidoId], (err) => {
                        if (err) {
                            console.error('Error al eliminar el pedido: ' + err.stack);
                            return res.status(500).send('Error al eliminar el pedido');
                        } else {
                            res.status(200).send('Pedido eliminado correctamente');
                        }
                    });
                }
            });
        }
    });
});

//Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ' + port);
});