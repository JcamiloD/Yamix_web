const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Obtener novedades, eventos y clases, y renderizar la vista de novedades
exports.traerNovedades = async (req, res) => {
    try {
        const [novedades, eventos, clases] = await Promise.all([
            fetch(`${process.env.pathApi}/traer_novedades`).then(res => res.json()),
            fetch(`${process.env.pathApi}/traer_eventos`).then(res => res.json()),
            fetch(`${process.env.pathApi}/traer_clases`).then(res => res.json()),
        ]);
        res.render('novedades', { novedades, eventos, clases });
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

/// Obtener una novedad por ID
exports.obtenerNovedad = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_novedad/${id}`);
        const data = await response.json();
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Novedad no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener la novedad:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Agregar una nueva novedad
exports.agregarNovedad = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/agregar_novedad`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al agregar la novedad:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar una novedad
exports.actualizarNovedad = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`http://localhost:4000/api/actualizar_novedad/${id}`, { // URL fija
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar la novedad:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Eliminar una novedad
exports.eliminarNovedad = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_novedad/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar la novedad:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Mostrar el formulario para agregar una novedad
exports.mostrarAgregarNovedad = (req, res) => {
    res.render('agregarNovedad');
};

// Mostrar el formulario para actualizar una novedad
exports.mostrarActualizarNovedad = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_novedad/${id}`);
        const novedad = await response.json();
        res.render('actualizarNovedad', { novedad });
    } catch (error) {
        console.error('Error al obtener novedad:', error);
        res.status(500).send('Error interno del servidor');
    }
};