const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.traer = async (req, res, next) => {
    try {
        // Hacer una solicitud GET al endpoint de la API
        const response = await fetch('http://localhost:4000/api/traer_clases');
        const data = await response.json(); // Convertir la respuesta a JSON
        // Guardar los datos en `res.locals` para que estén disponibles en la vista
        res.locals.data = data;
        next(); // Pasar el control a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};