const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const auth = require('./routes/auth.routes.js');
const clases = require('./routes/clasesCrud.routes.js');
const roles = require('./routes/roles.routes.js');
const rutas = require('./routes/routes.js');
const usuarios = require('./routes/usuarios.routes.js');
const catalogo = require('./routes/catalogo.routes.js');
const novedades = require('./routes/novedad.routes.js'); // Incluye el archivo de rutas para novedades
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Configura cookie-parser para manejar cookies
app.use(cookieParser());

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto si tu frontend está en otra URL
    credentials: true // Permite el envío de cookies
}));

// Configura el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configura la carpeta para archivos estáticos
app.use(express.static('public'));

// Configura el parseo de solicitudes URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Carga las variables de entorno
dotenv.config({ path: './env/.env' });

// Configura las rutas
app.use('/', auth, clases, roles, rutas, usuarios, catalogo, novedades);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('Server running in port http://localhost:3000/');
});
