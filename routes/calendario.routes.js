const express = require('express');
const eventos = require('../controller/calendarioController');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');

// Integrar middleware para verificar permisos y renderizar calendario
router.get('/calendarioUser', verifyToken, restrictToPermiso('calendario estudiante','calendario profesor'), (req, res) => {
    // Comprobar el rol o permisos del usuario cargados en req.usuario
    const { rol } = req.usuario;

    if (rol === 'profesor') {
        res.render('calendarioProfe', { alert: false });
    } else {
        res.render('calendarioUser', { alert: false });
    }
});




router.get('/traer_eventos', eventos.traerEventos);
router.get('/obtener_evento/:id', eventos.obtenerEvento);
router.post('/agregar_evento', eventos.agregarEvento);
router.post('/actualizar_evento/:id', eventos.actualizarEvento);
router.delete('/eliminar_evento/:id', eventos.eliminarEvento);
router.get('/traerEventosClase', eventos.traerEventosClase);

router.get('/modalUpdateEvento', function(req, res) {
    res.render('modalUpdateEvento.ejs'); 
});

module.exports = router;
