const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express();

// Seteamos motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Seteamos la carpeta public
app.use(express.static('public'));

// Parseamos solicitudes URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});


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
