const express = require('express');
const eventos = require('../controller/calendarioController');
const router = express.Router();

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
