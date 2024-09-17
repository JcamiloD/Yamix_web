const express = require('express');
const router = express.Router();
const novedadesController = require('../controller/novedadController');

// Rutas para el CRUD de novedades
router.get('/traer_novedades', novedadesController.traerNovedades);
router.get('/obtener_novedad/:id', novedadesController.obtenerNovedad);
router.post('/agregar_novedad', novedadesController.agregarNovedad);
router.post('/actualizar_novedad/:id', novedadesController.actualizarNovedad);
router.delete('/eliminar_novedad/:id', novedadesController.eliminarNovedad);

// Ruta para mostrar el modal de actualización de novedades
router.get('/modalUpdateNovedad', function (req, res) {
    res.render('modalUpdateNovedad');
});
router.get('/novedades', novedadesController.traerNovedades);

router.post('/actualizar_novedad/:id', novedadesController.actualizarNovedad);


module.exports = router;
