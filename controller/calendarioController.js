// Cambia require('node-fetch') a una importación dinámica
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
  
exports.traerEventos = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_eventos`);
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
        const response = await fetch(`${process.env.pathApi}/obtener_evento/${id}`);
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
        const response = await fetch('http://localhost:4000/api/agregar_evento', { // URL fija
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${process.env.pathApi}/actualizar_evento/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${process.env.pathApi}/eliminar_evento/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).send('Error interno del servidor');
    }
};
