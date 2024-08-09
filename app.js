const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

// Seteamos motor de plantillas
app.set('view engine', 'ejs');

// Seteamos la carpeta public
app.use(express.static('public'));

// Parseamos solicitudes URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

// Seteamos las cookies
app.use(cookieParser());

// Usamos las rutas definidas
app.use('/', require('./routes/routes.js'));

// Iniciamos el servidor
app.listen(3000, () => {
    console.log('Server running in port http://localhost:3000/');
});
