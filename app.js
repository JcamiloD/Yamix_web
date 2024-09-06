const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const auth = require('./routes/auth.routes.js');
const clases = require('./routes/clasesCrud.routes.js');
const roles = require('./routes/roles.routes.js');
const rutas = require('./routes/routes.js');
const usuarios = require('./routes/usuarios.routes.js');

const app = express();

// Seteamos motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Seteamos la carpeta public
app.use(express.static('public'));

// Parseamos solicitudes URL-encoded y JSON (debe ir antes de las rutas)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Seteamos las cookies
app.use(cookieParser());

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

// Rutas
app.use('/', auth, clases, roles, rutas, usuarios);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});

// Iniciamos el servidor
app.listen(3000, () => {
    console.log('Server running in port http://localhost:3000/');
});
