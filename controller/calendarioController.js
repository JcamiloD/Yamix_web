const jwt = require('jsonwebtoken');



const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Función para obtener el token de las cookies
function getTokenFromCookies(req) {
    const token = req.cookies?.token; // Asumiendo que el token está en las cookies bajo 'token'
    if (!token) {
        throw new Error('Token no encontrado en las cookies');
    }
    return token;
}


//estudiante


exports.traerEventosClase = async function (req, res) {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.decode(token);
        const nombre_clase = decodedToken.clase;

        const response = await fetch(`${process.env.pathApi}/traerEventosPorNombreClase/${nombre_clase}`);
        
        if (!response.ok) {
            return res.status(500).json({ error: 'Error al obtener las asistencias' });
        }
        const data = await response.json();
        return res.json(data); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



//admin

exports.traerEventos = async (req, res) => {
    try {
        const token = getTokenFromCookies(req); // Extraer el token

        const response = await fetch(`${process.env.pathApi}/traer_eventos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un evento por ID
exports.obtenerEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const token = getTokenFromCookies(req); // Extraer el token

        const response = await fetch(`${process.env.pathApi}/obtener_evento/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Evento no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.agregarEvento = async (req, res) => {
    try {
        const token = getTokenFromCookies(req); // Extraer el token

        const response = await fetch('http://localhost:4000/api/agregar_evento', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al agregar el evento:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar evento
exports.actualizarEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const token = getTokenFromCookies(req); // Extraer el token

        const response = await fetch(`${process.env.pathApi}/actualizar_evento/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// Eliminar evento
exports.eliminarEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const token = getTokenFromCookies(req); // Extraer el token

        const response = await fetch(`${process.env.pathApi}/eliminar_evento/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).send('Error interno del servidor');
    }
};
